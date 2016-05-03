# Sternburg Bingo App
Die Sternburg Brauerei veranstaltet bis zum 31.7.2016 ein Gewinnspiel. 
Besser als ich das mit eigenen Worten beschreiben kann, ist es auf ihrer [Homepage](http://www.sternburg-bier.de/sternburg-bier/bingo/) beschrieben.
Es wird Bingo auf fünf unterschiedlichen [Feldern](http://www.sternburg-bier.de/sternburg9x/export/shared/dokumente/Teilnahmekarte-Bierbingo.pdf) gespielt.
Ziel ist jeweils entweder eine horizontale, eine vertikale oder eine diagonale Reihe mit fünf Felder durch Kronkorken zu sammeln.

Die App erlaubt es euch - nach erfolgtem Facebook Login - eure Kronkorken hinzuzufügen. 
Habt ihr euch für einen Gewinn qualifiziert, so wird dies angezeigt und ihr könnt die Kronkorken entfernen.

## Installation
Ich empfehle die Verwendung von [virtualenv](https://virtualenv.pypa.io/en/latest/). 
Solltet ihr darauf verzichten, müsst ihr die shebang Zeile in den Python Scripten im root Verzeichnis anpassen.

Das virtualenv Verzeichnis wird initialisiert über:

    python -m virtualenv flask
  
Danach aktiviert man die virtuelle Umgebung mit:
  
    source flask/bin/activate
  
Die Abhängigkeiten werden installiert mit:
  
    pip install -r requirements.txt
