<!-- * XAMPP DATABASE -->
OPEN : XAMPP CONTROL PANEL

CLICK : START ON APACHE

CLICK : START ON MYSQL

<!-- * PHPMYADMIN -->
OPEN : CHROME

TYPE : http://localhost/phpmyadmin/ 

NAVIGATE: ON LEFT SIDE PANEL > CLICK NEW

TYPE ON DATABASE NAME : gquiz

CLICK : CREATE BUTTON

NAVIGATE: ON THE TOP PANEL CLICK IMPORT > Choose File > Locate using that window the gquiz.sql in this project folder > Click Open > Import

<!-- * VS CODE -->
OPEN : VS CODE

PRESS : (CTRL + SHIFT + ` or Backtick) or navigate at the upper left > Terminal > New Terminal

TYPE ON TERMINAL : git clone https://github.com/jiro-mendador/gquiz.git

TYPE ON TERMINAL : cd gquiz

TYPE ON TERMINAL : python -m venv env

TYPE ON TERMINAL : cd env/Scripts

TYPE ON TERMINAL : ./activate

TYPE ON TERMINAL : pip install -r requirements.txt

TYPE ON TERMINAL : cd ../../

TYPE ON TERMINAL : cd server

TYPE ON TERMINAL : python .\manage.py runserver

NAVIGATE : ON VS CODE LEFT SIDE PANEL > OPEN client folder > pages > RIGHT CLICK: index.html > Open With Live Server or Open with Chrome

<!-- DONE! -->a