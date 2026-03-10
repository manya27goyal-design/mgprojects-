#!/bin/bash

# --- Configuration & Files ---
MENU_FILE="menu.txt"
SALES_FILE="sales_log.txt"
TEMP_ORDER_FILE=".temp_order.txt" # Hidden file to store current cart

# --- Colors for UI ---
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# --- Initialization & Migration ---
# Create menu file if it doesn't exist
if [ ! -f "$MENU_FILE" ]; then
    # Format: Category|Name|Price|Stock
    # -- Drinks --
    echo "Drinks|Virgin Mojito|2.49|100" > "$MENU_FILE"
    echo "Drinks|Classic Cold Coffee|2.99|50" >> "$MENU_FILE"
    echo "Drinks|Peach Iced Tea|3.99|50" >> "$MENU_FILE"
    # -- Asian --
    echo "Asian|Spring Rolls|4.99|30" >> "$MENU_FILE"
    echo "Asian|Honey Chilli Lotus Stem|8.99|20" >> "$MENU_FILE"
    # -- Continental --
    echo "Continental|Chef Special Burger|5.99|50" >> "$MENU_FILE"
    echo "Continental|Mac n Cheese Pasta|9.99|15" >> "$MENU_FILE"
    # -- Indian --
    echo "Indian|Dal Makhni|4.99|20" >> "$MENU_FILE"
    echo "Indian|Paneer Tikka|5.99|20" >> "$MENU_FILE"
    # -- Breads --
    echo "Breads|Garlic Naan|1.09|100" >> "$MENU_FILE"
    echo "Breads|Tandoori Roti|0.99|100" >> "$MENU_FILE"
    # -- Desserts --
    echo "Desserts|Ice Cream|3.99|50" >> "$MENU_FILE"
    echo "Desserts|Brownie|4.99|40" >> "$MENU_FILE"
    # -- Kids --
    echo "Kids Menu|Mini Pizza|5.09|30" >> "$MENU_FILE"
    echo "Kids Menu|Cheese Balls|3.49|50" >> "$MENU_FILE"
else
    # MIGRATION CHECK: Check if file has less than 4 columns (Category missing)
    if [ "$(head -n 1 "$MENU_FILE" | awk -F "|" '{print NF}')" -lt 4 ]; then
        echo -e "${YELLOW}Old menu format detected. Upgrading to include Categories...${NC}"
        # Prepend "General|" to every line
        awk -F "|" 'BEGIN{OFS="|"} {$0="General|" $0; print}' "$MENU_FILE" > "menu.tmp" && mv "menu.tmp" "$MENU_FILE"
    fi
fi

if [ ! -f "$SALES_FILE" ]; then
    touch "$SALES_FILE"
fi

# --- Helper Functions ---

pause() {
    read -p "Press [Enter] to continue..."
}

print_header() {
    clear
    echo -e "${CYAN}==============================================${NC}"
    echo -e "${CYAN}    BASH RESTAURANT MANAGEMENT SYSTEM         ${NC}"
    echo -e "${CYAN}==============================================${NC}"
}

# --- Customer Functions ---

show_menu() {
    filter="$1"
    echo -e "${YELLOW}--- Current Menu ---${NC}"
    # Formatting: ID, Category, Item, Price, Stock
    echo -e "ID\tCategory\t\tItem\t\t\tPrice\tStock"
    echo "---------------------------------------------------------------------------"

    if [ -z "$filter" ]; then
        awk -F "|" '{printf "%d\t%-12s\t%-25s\t$%.2f\t%s\n", NR, $1, $2, $3, $4}' "$MENU_FILE"
    else
        # Filter by category ($1) case-insensitive, but keep original Line Numbers (NR)
        awk -F "|" -v q="$filter" 'tolower($1) ~ tolower(q) {printf "%d\t%-12s\t%-25s\t$%.2f\t%s\n", NR, $1, $2, $3, $4}' "$MENU_FILE"
    fi
    echo "---------------------------------------------------------------------------"
}

take_order() {
    grand_total=0
    > "$TEMP_ORDER_FILE"
    current_filter=""

    while true; do
        print_header
        show_menu "$current_filter"

        # Show Cart
        if [ -s "$TEMP_ORDER_FILE" ]; then
             echo -e "\n${BLUE}--- Current Cart ---${NC}"
             awk -F "|" '{printf "%-15s x%d\n", $1, $2}' "$TEMP_ORDER_FILE"
             echo -e "Current Total: ${YELLOW}\$$grand_total${NC}"
             echo "--------------------"
        fi

        total_items=$(wc -l < "$MENU_FILE")

        echo -e "\nOptions:"
        echo -e "  [${GREEN}ID${NC}] Enter Item ID to add"
        echo -e "  [${CYAN}f${NC}]  Filter by Category"
        echo -e "  [${CYAN}a${NC}]  Show Full Menu"
        echo -e "  [${RED}0${NC}]  Finish & Pay"
        echo -n "Selection: "
        read -r input

        # --- MENU NAVIGATION LOGIC ---
        if [ "$input" == "f" ] || [ "$input" == "F" ]; then
            echo -e "\n${BLUE}--- Categories ---${NC}"
            cut -d '|' -f 1 "$MENU_FILE" | sort | uniq
            echo -e "------------------"
            echo -n "Enter Category Name: "
            read -r current_filter
            continue
        elif [ "$input" == "a" ] || [ "$input" == "A" ]; then
            current_filter=""
            continue
        fi

        # Treat input as Item ID
        item_id="$input"

        # --- CHECKOUT ---
        if [[ "$item_id" == "0" ]]; then
            if [ ! -s "$TEMP_ORDER_FILE" ]; then
                echo -e "${RED}Order cancelled.${NC}"
                pause; return
            else
                break
            fi
        fi

        # --- VALIDATION ---
        if [[ ! "$item_id" =~ ^[0-9]+$ ]] || [ "$item_id" -lt 0 ] || [ "$item_id" -gt "$total_items" ]; then
            echo -e "${RED}Invalid Selection.${NC}"
            sleep 1; continue
        fi

        # --- GET ITEM DETAILS ---
        item_line=$(sed "${item_id}q;d" "$MENU_FILE")

        # Extract fields
        item_category=$(echo "$item_line" | cut -d '|' -f 1)
        item_name=$(echo "$item_line" | cut -d '|' -f 2)
        item_price=$(echo "$item_line" | cut -d '|' -f 3)
        current_stock=$(echo "$item_line" | cut -d '|' -f 4)

        echo -e "Selected: ${CYAN}$item_category - $item_name${NC}"
        echo -e "How many would you like?"
        read -r quantity

        if [[ ! "$quantity" =~ ^[0-9]+$ ]] || [ "$quantity" -le 0 ]; then
            echo -e "${RED}Invalid quantity.${NC}"
            sleep 1; continue
        fi

        # --- STOCK CHECK LOGIC ---
        in_cart_qty=$(grep "^$item_name|" "$TEMP_ORDER_FILE" | awk -F "|" '{sum+=$2} END {print sum+0}')
        total_requested=$((quantity + in_cart_qty))

        if [ "$total_requested" -gt "$current_stock" ]; then
            echo -e "${RED}ERROR: Insufficient Stock!${NC}"
            echo "Available: $current_stock"
            echo "In Cart:   $in_cart_qty"
            echo -e "You can only add ${YELLOW}$((current_stock - in_cart_qty))${NC} more."
            pause
            continue
        fi

        # Calculate Subtotal
        subtotal=$(awk "BEGIN {printf \"%.2f\", $item_price * $quantity}")
        grand_total=$(awk "BEGIN {printf \"%.2f\", $grand_total + $subtotal}")

        echo "$item_name|$quantity|$subtotal" >> "$TEMP_ORDER_FILE"
        echo -e "${GREEN}Added to cart.${NC}"
        sleep 0.5
    done

    # --- FINAL PROCESSING ---
    print_header
    echo -e "${GREEN}--- FINAL RECEIPT ---${NC}"
    awk -F "|" '{printf "%-15s\t%d\t$%.2f\n", $1, $2, $3}' "$TEMP_ORDER_FILE"
    echo "--------------------------------"
    echo -e "GRAND TOTAL: ${YELLOW}\$$grand_total${NC}"

    current_date=$(date '+%Y-%m-%d %H:%M:%S')

    # Process items: Add to sales log AND reduce stock
    while IFS="|" read -r name qty sub; do
        # 1. Log Sale
        echo "$current_date|$name|$qty|$sub" >> "$SALES_FILE"

        # 2. Update Stock in MENU_FILE
        awk -F "|" -v target="$name" -v q="$qty" 'BEGIN{OFS="|"} $2==target {$4=$4-q} {print}' "$MENU_FILE" > "menu.tmp" && mv "menu.tmp" "$MENU_FILE"

    done < "$TEMP_ORDER_FILE"

    echo -e "\n${BLUE}Transaction Complete & Inventory Updated!${NC}"
    rm "$TEMP_ORDER_FILE"
    pause
}

# --- Manager Functions ---

add_item() {
    print_header
    echo -e "${YELLOW}--- Add New Item ---${NC}"
    echo "Suggested Categories: Drinks, Asian, Continental, Indian, Breads, Desserts, Kids Menu"
    read -p "Enter Category: " new_cat
    read -p "Enter Item Name: " new_name
    read -p "Enter Item Price: " new_price
    read -p "Enter Initial Stock: " new_stock

    if [[ ! "$new_price" =~ ^[0-9]+(\.[0-9]+)?$ ]] || [[ ! "$new_stock" =~ ^[0-9]+$ ]]; then
        echo -e "${RED}Invalid input format.${NC}"
    else
        echo "$new_cat|$new_name|$new_price|$new_stock" >> "$MENU_FILE"
        echo -e "${GREEN}Item added.${NC}"
    fi
    pause
}

restock_item() {
    print_header
    show_menu
    echo -e "Enter ${GREEN}Item ID${NC} to Restock:"
    read -r item_id
    total_items=$(wc -l < "$MENU_FILE")

    if [[ ! "$item_id" =~ ^[0-9]+$ ]] || [ "$item_id" -lt 1 ] || [ "$item_id" -gt "$total_items" ]; then
         echo -e "${RED}Invalid ID.${NC}"
         pause; return
    fi

    echo "Enter amount to add:"
    read -r amount

    if [[ ! "$amount" =~ ^[0-9]+$ ]]; then
        echo -e "${RED}Invalid amount.${NC}"
        pause; return
    fi

    awk -F "|" -v line="$item_id" -v amt="$amount" 'BEGIN{OFS="|"} NR==line {$4=$4+amt} {print}' "$MENU_FILE" > "menu.tmp" && mv "menu.tmp" "$MENU_FILE"

    echo -e "${GREEN}Stock updated successfully.${NC}"
    pause
}

edit_item() {
    print_header
    show_menu
    echo -e "${YELLOW}--- Edit Existing Item ---${NC}"
    echo -e "Enter ${GREEN}Item ID${NC} to Edit:"
    read -r item_id
    
    total_items=$(wc -l < "$MENU_FILE")

    # Validation
    if [[ ! "$item_id" =~ ^[0-9]+$ ]] || [ "$item_id" -lt 1 ] || [ "$item_id" -gt "$total_items" ]; then
         echo -e "${RED}Invalid ID.${NC}"
         pause; return
    fi

    # Get current details
    current_line=$(sed "${item_id}q;d" "$MENU_FILE")
    
    # Extract fields
    old_cat=$(echo "$current_line" | cut -d '|' -f 1)
    old_name=$(echo "$current_line" | cut -d '|' -f 2)
    old_price=$(echo "$current_line" | cut -d '|' -f 3)
    old_stock=$(echo "$current_line" | cut -d '|' -f 4)

    echo -e "\n${CYAN}Tip: Press [Enter] to keep the current value.${NC}"
    echo "--------------------------------"

    # 1. Edit Category
    echo -e "Current Category: ${YELLOW}$old_cat${NC}"
    read -p "New Category: " new_cat
    new_cat=${new_cat:-$old_cat} # Use old value if input is empty

    # 2. Edit Name
    echo -e "Current Name: ${YELLOW}$old_name${NC}"
    read -p "New Name: " new_name
    new_name=${new_name:-$old_name}

    # 3. Edit Price
    echo -e "Current Price: ${YELLOW}$old_price${NC}"
    read -p "New Price: " new_price
    new_price=${new_price:-$old_price}

    # 4. Edit Stock
    echo -e "Current Stock: ${YELLOW}$old_stock${NC}"
    read -p "New Stock: " new_stock
    new_stock=${new_stock:-$old_stock}

    # Validation
    if [[ ! "$new_price" =~ ^[0-9]+(\.[0-9]+)?$ ]] || [[ ! "$new_stock" =~ ^[0-9]+$ ]]; then
        echo -e "${RED}Invalid price or stock format. Edit cancelled.${NC}"
        pause; return
    fi

    # Construct new line
    new_line="$new_cat|$new_name|$new_price|$new_stock"

    # Update file using awk
    awk -v line="$item_id" -v text="$new_line" 'NR==line {$0=text} 1' "$MENU_FILE" > "menu.tmp" && mv "menu.tmp" "$MENU_FILE"

    echo -e "${GREEN}Item updated successfully!${NC}"
    pause
}

delete_item() {
    print_header
    show_menu
    echo -e "${RED}Enter ID to delete:${NC}"
    read -r del_id
    total_items=$(wc -l < "$MENU_FILE")

    if [[ ! "$del_id" =~ ^[0-9]+$ ]] || [ "$del_id" -lt 1 ] || [ "$del_id" -gt "$total_items" ]; then
         echo -e "${RED}Invalid ID.${NC}"
         pause; return
    fi

    sed -i.bak "${del_id}d" "$MENU_FILE"
    echo -e "${GREEN}Item deleted.${NC}"
    pause
}

view_sales() {
    print_header
    echo -e "${YELLOW}--- Sales Log ---${NC}"
    if [ ! -s "$SALES_FILE" ]; then
        echo "No sales recorded yet."
    else
        echo -e "Date\t\t\tItem\tQty\tTotal"
        echo "--------------------------------------------------"
        awk -F "|" '{printf "%s\t%-10s\t%d\t$%.2f\n", $1, $2, $3, $4}' "$SALES_FILE"
        echo "--------------------------------------------------"
        grand_total=$(awk -F "|" '{sum+=$4} END {printf "%.2f", sum}' "$SALES_FILE")
        echo -e "${GREEN}TOTAL REVENUE: \$$grand_total${NC}"
    fi
    pause
}

admin_panel() {
    while true; do
        print_header
        echo -e "${YELLOW}ADMINISTRATION PANEL${NC}"
        echo "1. Add New Item"
        echo "2. Restock Existing Item"
        echo "3. Edit Item Details"
        echo "4. Delete Item"
        echo "5. View Sales Report"
        echo "6. Return to Main Menu"
        echo -n "Select Option: "
        read -r admin_choice

        case $admin_choice in
            1) add_item ;;
            2) restock_item ;;
            3) edit_item ;;
            4) delete_item ;;
            5) view_sales ;;
            6) return ;;
            *) echo -e "${RED}Invalid Option${NC}"; pause ;;
        esac
    done
}

# --- Main Loop ---

while true; do
    print_header
    echo "1. Place Order"
    echo "2. Admin Panel"
    echo "3. Exit"
    echo -n "Select Option: "
    read -r choice

    case $choice in
        1) take_order ;;
        2)
            read -s -p "Enter Admin Password: " password
            if [ "$password" == "admin123" ]; then
                admin_panel
            else
                echo -e "\n${RED}Wrong Password!${NC}"
                pause
            fi
            ;;
        3) echo -e "${GREEN}Please Visit Us Again!${NC}"; exit 0 ;;
        *) echo -e "${RED}Invalid Option${NC}"; pause ;;
    esac
done