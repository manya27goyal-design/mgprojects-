import tkinter as t
from tkinter import *
import random as r
def fun():
    x=guess.get()
    finalscore.set(score.get())
    if score.get()>0:
 
        if x > 50 or x<0:
            hint.set("You just lost 1 Chance")
            score.set(score.get()-1)
            finalscore.set(score.get())
   
        elif num==x:
            hint.set("Congratulation YOU WON!!!")
            score.set(score.get()-1)
            finalscore.set(score.get())
     
        elif num > x:
            hint.set("Your guess was too low: Guess a number higher ")
            score.set(score.get()-1)
            finalscore.set(score.get())
        elif num < x:
            hint.set("Your guess was too High: Guess a number Lower ")
            score.set(score.get()-1)
            finalscore.set(score.get())
    else:
         hint.set(f"Game Over You Lost the number was {num}")
         
win=t.Tk()
win.geometry("750x750")
win.title("mg games")

num=r.randint(1,30)
hint = t.StringVar()
score = t.IntVar()
finalscore = t.IntVar()
guess = t.IntVar()

Entry(win,textvariable=guess,width=5,font=('ubuntu',50),
relief=GROOVE).place(relx=0.5,rely=0.3,anchor=CENTER)

Entry(win,textvariable=hint,width=50,font=('courier',18),
relief=GROOVE,bg='pink').place(relx=0.5,rely=0.7,anchor=CENTER)

Entry(win, text=finalscore, width=4,font=('Ubuntu', 25),
relief=GROOVE).place(relx=0.61, rely=0.85, anchor=CENTER)

Label(win, text='Guess the number to Win ',
font=("Courier", 25)).place(relx=0.5, rely=0.09, anchor=CENTER)

Label(win, text='chances left to guess',
font=("Courier", 15)).place(relx=0.3, rely=0.85, anchor=CENTER)

Button(win, width=5, text='CHECK', font=('Courier', 25), command=fun,
relief=GROOVE,bg='light blue').place(relx=0.5, rely=0.5, anchor=CENTER)

hint.set("guess a number between 1 to 30")
score.set(5)
finalscore.set(score.get())






