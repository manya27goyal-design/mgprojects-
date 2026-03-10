import random as r

d={'coffee': {'hot coffee':[60,'milk','arabica beans','sugar'], 'cold coffee': [70,'milk','ice', 'arabica beans','sugar'],
'cafe frappe':[150,'ice','sugar','robusta beans','cream'], 'americano':[170,'excelsa beans','milk','cream'], 'cafe latte':[145,'robusta beans','milk','steam'],
'cafe moccha':[172,'liberica beans','cocoa powder','sugar','milk'],'black coffee' :[40,'arabica beans'],'espresso':[75,'robusta beans','steam']},
'tea':{'lemon iced tea':[80,'ice','lemon extract','suger'], 'green tea':[50,'matcha green leaves'],'milk tea':[50,'milk',' black leaves'],
'black tea':[45,'black leaves'],'peach iced tea':[120,'peach extract','ice','sugar'],'masala tea':[60,'sugar','black leaves','ginger','cardamom'],
'jasmine tea':[80,'jasmine extract','sugar']},
'mocktails':{'mojito':[100,'lemon extract','mint','soda','sugar syrup','ice'],'blue lagoon':[150,'blue curacao','lemon extract','sugar syrup','soda','ice'],
'green apple mojito':[120,'lemon extract','sugar syrup','mint','soda','green apple extract'],'mint lime soda':[80,'lemon extract','sugar syrup','mint']},             
'sides': {'sweet bread':[30,'wheat flour','milk','yeast','sugar'],'brownie':[75,' wheat flour','sugar','cocoa powder'],
'cookies':[100,'all purpose flour','chocolate','choco chips'], 'donut':[85,'all purpose flour','fondent','sprinkles','cream']},
'cakes':{'lava cakes':[100,'butter','sugar','chocolate syrup','pastry flour'], 'muffin':[100,'pastry flour','sugar','chocolate and vanilla'],
'chocolate cake':[500,' wheat flour','sugar','chocolate'], 'cream puff':[150,'butter','all purpose flour','cream'],'cheese cake':[250,'cream','sugar','cheese']},
'starters': {'pasta':[300,'mixed herbs','penne pasta','red sauce'],'puff pastry':[45,'onion','cheese',' pastry flour'], 'fries':[50,'salted'],
'health sandwich':[150,'pepper','cucumber','tomato','dressing','onion'], 'paneer roll':[160,'cornflour','lettuce','cucumber','tomato','cottage cheese'],
'nachos':[150,'tortella chip','cheese']},
'additions':{'whipped cream':[50],'nutella':[80],'hazelnut':[120],'chocochips':[20],'sprinkles':[30],'coffee syrup':[50]}}

def idcheck():
    u=input('enter name')
    if u == 'manya':
        pa=int(input('enter password'))
        if pa==3333:
            print('*'*130)
            print(' ' *50,' WELCOME TO CAFE AMIGO')
            print('*'*130)
            sk()
        else:
            print('give correct password')
    else:
        print('*'*130)
        print(' ' *50,' WELCOME TO CAFE AMIGO')
        print('*'*130)
        display()
        print()
        print('offers available :  10%off on order above 500 and a free treat on orders above 1000')
        print('1.order and bill')
        print('2.sort by price')
        print('3.sort by category')
        print('4.sort by ingredient')
        print('5.exit')
        ch()
        print()
        print('YOUR ORDER WILL BE READY SHORTLY, PLEASE VISIT AGAIN')

def sk():
    cus=input('would you like to make changes to the menu')
    if cus.lower() == 'yes':
         update()
    else:
        print('Thank You')
        
def update():
    display()
    while True:
        print('\n1.add new product')
        print('2.change price of product')
        print('3.delete product')
        print('4.add ingredient')
        print('5.exit')
        choice=int(input('enter what would you like to do'))
        if choice==1:
                n=input('enter category where you want to add the product')
                m=input('enter product to be added')
                l=[]
                c=int(input('enter price '))
                l.append(c)
                while True:
                    i=input('enter ingredient (or type "exit" to stop)')
                    if i == 'exit': break
                    l.append(i)
                    a=input('more ingredient to add')
                    if a.lower() == 'no':
                        break    
                d[n][m]=l
                
        elif choice==2:
                n=input('enter category where you want to make changes')
                m=input('enter product whose price to be changed')
                c=int(input('enter  new price '))
                d[n][m][0]=c
                
        elif choice==3:
                n=input('enter category from which you wish to delete the element')
                m=input('enter product to be deleted')
                d[n].pop(m)
                
        elif choice==4:
                n=input('enter category where you want to add ingredient')
                m=input('enter product whose ingredient you wish to add')
                c=input('new ingredient to be added')
                d[n][m].append(c)
        
        elif choice==5:
                break
                
        else:
                print('enter valid no.')
        print()        
        k=input('do you wish to continue updating')
        if k.lower() == 'no':
            break
    print('updated menu')
    display()

def ch():
    choice=int(input('what would you like to do'))
    if choice==1:
        order()    
    elif choice==2:
        sortp()    
    elif choice==3:
        sortc()
    elif choice==4:
        sorting()
    elif choice==5:
        return

def sortp():
    s=int(input('enter starting price'))
    e=int(input('enter ending price'))
    for x in d:
        for y in d[x]:
            if d[x][y][0]>s and d[x][y][0]<e:
                print(x,':',y,d[x][y])
    print('order')
    order()

def sortc():
    n=input('enter category')
    for x in d:
        for y in d[x]:
            if n==x:
                print(y,' ' ,d[x][y])
    print('order')
    order()
                
def sorting():
    s=input('enter ingredient to be present')
    for x in d:
        for y in d[x]:
            if s in d[x][y]:
                print(x,':',y,' ',d[x][y])
    print('order')
    order()
    
def display():
    for x in d:
        print()
        print('-'*130)
        print(x)
        for y in d[x]:
            print(y,':',d[x][y])
    print()

def order():
    p=0
    c=''
    while True:
        m=input('enter category (or type "exit" to finish)')
        if m == 'exit': break
        o=input('enter your order')
        if m in d and o in d[m]:
            p=p+d[m][o][0]
            c=input('do u wish to add more')
            if c.lower() =='no':
                break
        else:
            print("Item/Category not found")
            c=input('do u wish to try again?')
            if c.lower() == 'no':
                break
        if c.lower() == 'no':
            break

    if p>500 and p<1000:
        print("discount applied")
        print('your bill is',p-p*0.1)
    elif p>=1000:
        print('congratulations,you get a free treat')
        t={1:'dairy milk silk',2:' galaxy',3:' amul dark chocolate',4:' hersheys kisses',5:' kinder',6:'tiramisu',7:'lava cake',8:'pudding',9:'hot chocolate ball',10:' churros',11:' cookies',12:'chocolate ice cream',13:'cookies and cream',14:'vanilla ice cream',15:'butter scotch ice cream'}
        x=r.randint(1,15)
        print(t[x])
    else:
        print('your bill is',p)
                             
idcheck()
