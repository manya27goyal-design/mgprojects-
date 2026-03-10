import mysql.connector as m
import prettytable as pt

c = m.connect(host='localhost', user='root', password='scott')
cur = c.cursor()

def data():
    mycon = m.connect(host='localhost', user='root', password='scott')
    myc = mycon.cursor()
    qm = "drop database if exists boutique"
    q = "create database boutique"
    q0 = "use boutique"
    q1 = "create table curec (cuid int(3) primary key,name varchar(15),age int(3),address varchar(30),phno char(10),ordno int(3),dsize varchar(4))"
    q2 = "create table ord (ordno int(3) primary key,item varchar(15),material varchar(10),laces varchar(20),accessories varchar(15),cost int(5),dor date,dod date)"
    q3 = "create table matin (fid int(3) primary key,material varchar(10),length int(3),type varchar(10),cost int(5))"
    q4 = "create table emb (laces varchar(25),lalen int(5),lcost int(5),accessories varchar(10),aquan int(5),acost int(5))"
    q5 = '''insert into curec values
          (1,'shina',23,'h-3 shashtri nagar','7659435671',111,'m'),(2,'rohini',23,'h-12 shashtri nagar','7659426591',112,'m'),
          (3,'saryu',45,'c-21 krishna nagar','5346789876',113,'l'),(4,'prangal',30,'j3 ratanada','8753645789',114,'l'),
          (5,'anu',25,'a-53 panchavati colony','6534678976',115,'m'),(6,'shamita',20,'h-7 chb','7645369878',116,'s'),
          (7,'rita',40,'g28 shashtri nagar','6453785367',117,'xl'),(8,'ridhi',37,'122 surya colony','5467876547',118,'xl'),
          (9,'mina',29,'k-2 chb','5467876547',119,'l'),(10,'kashi',39,'s-1 dev nagar','8765645478',120,'xxl')'''
    q6 = '''insert into ord values(111,'anarkali','cotton','sequin lace','tassle',2000,'2023-06-12','2023-06-25'),
          (112,'lehenga set','silk','embroidary lace','sequin',8000,'2023-07-22','2023-08-05'),
          (113,'suit','cotton','silver lace','tassle',2500,'2023-07-25','2023-07-31'),
          (114,'plazzo','rayon',null,'sequin',800,'2023-08-07','2023-08-15'),
          (115,'saree set','chiffon','silver lace','tassle',5000,'2023-09-04','2023-09-20'),
          (116,'saree','linen','sequin lace','tassle',4800,'2023-09-10','2023-09-25'),
          (117,'suit','rayon','golden gota','sequin',2500,'2023-09-28','2023-10-10'),
          (118,'lehenga set','net','embroidary lace','beads',10000,'2023-10-05','2023-10-25'),
          (119,'sharara','silk','sequin lace','sequin',2000,'2023-10-15','2023-10-30'),
          (120,'saree set','net','silver lace','beads',8000,'2023-11-04','2023-11-20')'''
    q7 = '''insert into emb values('golden gota',50,10,'tassle',200,5),('sequin lace',20,100,'beads',300,5),
          ('silver lace',100,120,'buttons',500,2),('embroidary lace',100,50,'sequin',1000,5);'''
    q8 = '''insert into matin values(1,'georgette',50,'plain',10000),(2,'georgette',25,'printed',6250),
          (3,'cotton',200,'plain',20000),(4,'cotton',100,'printed',12500),(5,'silk',30,'pure',15000),(6,'rayon',80,'printed',8000),
          (7,'silk',30,'art',1500),(8,'net',70,'sequined',14000),(9,'net',50,'plain',2500),(10,'chiffon',50,'printed',20000);'''
    myc.execute(qm)
    myc.execute(q)
    myc.execute(q0)
    myc.execute(q1)
    myc.execute(q2)
    myc.execute(q3)
    myc.execute(q4)
    myc.execute(q5)
    myc.execute(q6)
    myc.execute(q7)
    myc.execute(q8)
    mycon.commit()
    mycon.close()
    cur.execute("use boutique")

def login():
    u = {'mgdata()': 123, 'ts': 1234}
    n = input('enter your id: ')
    if n in u:
        k = int(input('enter password: '))
        if k == u[n]:
            print('\nwelcome', n, 'what do u wish to do today')
            menumr()
        else:
            print('wrong password')
    else:
        print('enter valid id')
        login()

def menumr():
    while True:
        print('\n1.manage orders')
        print('2.manage customer records')
        print('3.manage inventory')
        print('4.I am done with updating')
        ch = int(input('\nenter task no.: '))
        if ch == 1:
            morders()
        elif ch == 2:
            cdetail()
        elif ch == 3:
            inventory()
        else:
            print('thank you for updations')
            break

def morders():
    while True:
        print('\n1.entering a new order')
        print('2.removal of completed order')
        print('3.displaying all the orders')
        print('4.updating order item')
        print('5.updating order material')
        print('6.updating cost of material')
        print('7.search on the basis of material')
        print('8.search in particular price range of materials')
        print('9.displaying customer id, their name and their orders')
        print('10.displaying cost of lace')
        print('11.displaying cost of accessories')
        print('12.displaying item with their total cost')
        print('13.I am done updating the orders')
        
        n = int(input('\nwhat is to be done? '))
        if n == 1:
            orn = int(input('enter order no: '))
            i = input('enter item ordered: ')
            m_mat = input('enter material of the item: ')
            p = int(input('enter price of item: '))
            doo = input('date of order (yyyy-mm-dd): ')
            dod = input('date of delivery (yyyy-mm-dd): ')
            ac = input('enter lace: ')
            ac1 = input('enter accessory: ')
            q = "insert into ord values ({},'{}','{}','{}','{}',{},'{}','{}')".format(orn, i, m_mat, ac, ac1, p, doo, dod)
            cur.execute(q)
            c.commit()
        elif n == 2:
            orn = int(input('enter order no of completed order: '))
            cur.execute("delete from ord where ordno={}".format(orn))
            cur.execute("delete from curec where ordno={}".format(orn))
            c.commit()
        elif n == 3:
            cur.execute("select * from ord")
            r = cur.fetchall()
            too = pt.PrettyTable(['ordno', 'item', 'material', 'laces', 'accessories', 'cost', 'dor', 'dod'])
            for t in r:
                too.add_row(t)
            print(too)
        elif n == 4:
            orn = int(input('enter order no to update: '))
            i = input('enter new item: ')
            cur.execute("update ord set item='{}' where ordno={}".format(i, orn))
            c.commit()
        elif n == 9:
            cur.execute("select cuid,name,item from ord,curec where curec.ordno=ord.ordno")
            r = cur.fetchall()
            too = pt.PrettyTable(['cuid', 'name', 'item'])
            for t in r:
                too.add_row(t)
            print(too)
        elif n == 13:
            break
        # ... (Other elif blocks following the same indent)

def cdetail():
    while True:
        print('\n1.entry of new customer')
        print('2.delete customer record')
        print('3.list all customer records')
        print('4.I am done updating the customer records')
        
        n = int(input('\nwhat would you like to do? '))
        if n == 1:
            uid = int(input('enter customer id: '))
            m_name = input('enter name: ')
            a = int(input('enter age: '))
            d = input('address: ')
            no = input('phone no: ')
            orn = int(input('order no: '))
            s = input('size (xs,s,m,l,xl,xxl): ')
            cur.execute("insert into curec values ({},'{}',{},'{}','{}',{},'{}')".format(uid, m_name, a, d, no, orn, s))
            c.commit()
        elif n == 3:
            cur.execute("select * from curec")
            r = cur.fetchall()
            too = pt.PrettyTable(['cuid', 'name', 'age', 'address', 'phno', 'ordno', 'dsize'])
            for t in r:
                too.add_row(t)
            print(too)
        elif n == 9:
            break

def inventory():
    while True:
        print('\n1.show status')
        print('7.exit inventory')
        n = int(input('\nchoice: '))
        if n == 1:
            cur.execute("select * from matin")
            r = cur.fetchall()
            too = pt.PrettyTable(['fid', 'material', 'length', 'type', 'cost'])
            for t in r:
                too.add_row(t)
            print(too)
        elif n == 7:
            break

data()
login()