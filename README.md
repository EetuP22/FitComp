# FitComp 🏋️‍♂️

**FitComp (Fitness Companion)** on kattava kuntosaliharjoittelun seuranta ja suunnittelusovellus, joka on toteutettu React Native ja Expo teknologioilla. Sovellus tarjoaa työkalut harjoitusohjelmien luomiseen, treenisuoritusten kirjaamiseen, kehityksen seuraamiseen sekä lähellä olevien kuntosalien löytämiseen.

## Ominaisuudet

### Pääominaisuudet
- **Treeniohjelmat**: Luo ja hallitse omia harjoitusohjelmia useilla treenipäivillä
- **Liikepankki**: Selaa yli 1000 liikettä wger.de API:sta yksityiskohtaisilla kuvauksilla ja lihasryhmätiedoilla, sekä kuvilla
- **Treenikirjanpito**: Tallenna treenisuoritukset sarjoilla, toistoilla, painoilla sekä muistiinpanoilla
- **Kehityksen seuranta**: 
  - Katso treenihistoriaa liikkeittäin suodatettuna
  - Seuraa painokehitystä visuaalisilla indikaattoreilla
  - Tilastot: yhteensä treenejä, eri liikkeitä, 7 päivän aktiivisuus
- **Kalenterin integraatio**: 
  - Ajasta treenipäivät ohjelmistasi
  - Visuaaliset merkit tehdyille (vihreä) ja suunnitelluille (sininen) treeneille
  - Oranssit pisteet päivämäärillä, joille on kirjattu treenejä
- **Kuntosalien kartta**: Interaktiivinen kartta läheisistä kuntosaleista OpenStreetMap-datalla ja etäisyyslaskennalla

### Käyttökokemus
- Material Design 3 käyttöliittymä React Native Paper komponenteilla
- Välilehtipohjainen navigaatio kuuden pääosion kanssa (Home, Map, Calendar, Progress, Programs, Exercises)
- Responsiivinen palaute snackbar ilmoituksilla
- Lataus ja tyhjien tilojen käsittely
- Pika-toiminnot Home näytöllä nopeaan navigointiin

## Käytetyt teknologiat

### Frontend-teknologiat
- **React Native** Alustariippumaton mobiilisovellusten kehitysalusta, mahdollistaa koodin jakamisen iOS:n ja Androidin välillä
- **Expo** (~52.0.23) Kehitysympäristö ja työkaluketju, joka yksinkertaistaa React Native kehitystä tarjoamalla valmiita moduuleja ja helpon testauksen
- **React Navigation v6**  Navigaatio ja reitityskirjasto
  - Bottom Tab Navigator  Alapalkin välilehdet päänavigaatioon
  - Stack Navigator Pinottu navigaatio näyttöjen välillä
  - Modal-esitykset Modaali-ikkunat erityistoiminnoille
- **React Native Paper** Material Design 3 -komponenttikirjasto, tarjoaa valmiit käyttöliittymäkomponentit (kortit, painikkeet, tekstikentät)
- **React Native Calendars** Kalenterinäkymät ja päivämäärien valinta

### Backend ja tietojen hallinta
- **SQLite** (expo-sqlite) Paikallinen tietokanta, mahdollistaa sovelluksen käytön ilman verkkoyhteyttä
- **Repository Pattern** Tietojen käsittelyn kerros, joka erottaa tietokantalogiikan käyttöliittymästä
- **Context API**  Tilan hallinta React-hookeille

### Ulkoiset palvelut
- **wger.de API**  Liikepankki (1000+ liikettä), tarjoaa yksityiskohtaiset liiketiedot, sekä kuvat ja lihasryhmät
- **OpenStreetMap API** (react-native-maps) Kartan ruudut ja kuntosalien sijaintitiedot
- **Expo Location**  Paikannus palvelut etäisyyslaskelmiin ja käyttäjän sijainnin määritykseen

### Kehitystyökalut ja -käytännöt
- **Git**  Versionhallinta projektin kehityksen seuraamiseen ja vaiheiden tallentamiseen
- **JavaScript**  Modernit JavaScript ominaisuudet (async/await, arrow functions, destructuring)
- **Component-based Architecture**  Modulaarinen rakenne uudelleenkäytettävillä komponenteilla
- **Hooks**  React Hooks pohjainen tilan ja efektien hallinta (useState, useEffect, useMemo, useContext)