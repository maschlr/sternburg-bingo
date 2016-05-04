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

Für die Konfiguration ist die Datei `config.py` vorgesehen, die im root Verzeichnis angelegt wird. Dort sind die folgenden Variablen notwendig:

    import os
    basedir = os.path.abspath(os.path.dirname(__file__))


    # Eure Datenbank URI. Zum entwickeln reicht die hier eingestellte slqite Datenbank vollkommen
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    WTF_CSRF_ENABLED = True

    SECRET_KEY = "<super_sicherer_schluessel>"

    OAUTH_CREDENTIALS = {'facebook': {
                          'id': '<eure_facebook_app_is>',
                          'secret': '<euer_facebook_app_secret>'
                          }
                      }

Um die Scripte ohne expliziten Interpreteraufruf ausführen zu können, müssen diese noch mit den entsprechenden Berechtigungen ausgestattet werden:

    chmod a+x db_create.py
    chmod a+x db_downgrade.py
    chmod a+x db_migrate.py
    chmod a+x db_upgrade.py
    chmod a+x run.py

 Nachdem die Datenbank erzeugt ist, kann der Entwicklungsserver gestartet werden:

    ./db_create.py
    ./run.py
    
