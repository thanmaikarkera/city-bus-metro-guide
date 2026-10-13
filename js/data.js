/*
  data.js - BUILT-IN BACKUP DATA
  -------------------------------
  This is the same SAMPLE data that seed.sql puts into Supabase.
  The website normally loads data from Supabase. If Supabase is not set up yet
  (or the internet/database fails), app.js falls back to this copy so the
  site still works during a demo.
*/

const SAMPLE_DATA = {
  stops: [
    {"id":"KSR","name_en":"Mandya Bus Stand","name_kn":"ಮಂಡ್ಯ ಬಸ್ ನಿಲ್ದಾಣ","lat":12.5279,"lng":76.8896,"has_lift":true,"has_escalator":true,"has_ramp":true,"has_tactile_path":true,"has_accessible_toilet":true},
    {"id":"RLY","name_en":"Mandya Railway Station","name_kn":"ಮಂಡ್ಯ ರೈಲು ನಿಲ್ದಾಣ","lat":12.5301,"lng":76.8999,"has_lift":true,"has_escalator":true,"has_ramp":true,"has_tactile_path":true,"has_accessible_toilet":true},
    {"id":"MIM","name_en":"MIMS Hospital","name_kn":"ಮಿಮ್ಸ್ ಆಸ್ಪತ್ರೆ","lat":12.526,"lng":76.9002,"has_lift":false,"has_escalator":false,"has_ramp":true,"has_tactile_path":true,"has_accessible_toilet":true},
    {"id":"ASH","name_en":"Ashok Nagar","name_kn":"ಅಶೋಕ ನಗರ","lat":12.5247,"lng":76.8971,"has_lift":false,"has_escalator":false,"has_ramp":true,"has_tactile_path":false,"has_accessible_toilet":false},
    {"id":"SUG","name_en":"Mysugar Factory","name_kn":"ಮೈಶುಗರ್ ಕಾರ್ಖಾನೆ","lat":12.5341,"lng":76.9024,"has_lift":true,"has_escalator":true,"has_ramp":true,"has_tactile_path":true,"has_accessible_toilet":false},
    {"id":"PES","name_en":"PES College of Engineering","name_kn":"ಪಿಇಎಸ್ ಎಂಜಿನಿಯರಿಂಗ್ ಕಾಲೇಜು","lat":12.5172,"lng":76.88,"has_lift":true,"has_escalator":false,"has_ramp":true,"has_tactile_path":true,"has_accessible_toilet":false},
    {"id":"GUT","name_en":"Guttalu","name_kn":"ಗುತ್ತಲು","lat":12.5246,"lng":76.9233,"has_lift":true,"has_escalator":false,"has_ramp":true,"has_tactile_path":true,"has_accessible_toilet":false},
    {"id":"IND","name_en":"Indavalu","name_kn":"ಇಂಡುವಾಳು","lat":12.5139,"lng":76.8518,"has_lift":true,"has_escalator":false,"has_ramp":true,"has_tactile_path":true,"has_accessible_toilet":false},
    {"id":"YEL","name_en":"Yeliyur","name_kn":"ಯಲಿಯೂರು","lat":12.5099,"lng":76.8287,"has_lift":true,"has_escalator":false,"has_ramp":true,"has_tactile_path":true,"has_accessible_toilet":false},
    {"id":"TUB","name_en":"Tubinakere","name_kn":"ತೂಬಿನಕೆರೆ","lat":12.4949,"lng":76.7942,"has_lift":true,"has_escalator":true,"has_ramp":true,"has_tactile_path":true,"has_accessible_toilet":true},
    {"id":"HAN","name_en":"Hanakere","name_kn":"ಹನಕೆರೆ","lat":12.5698,"lng":76.9779,"has_lift":true,"has_escalator":true,"has_ramp":true,"has_tactile_path":true,"has_accessible_toilet":true},
    {"id":"UMM","name_en":"Ummadahalli","name_kn":"ಉಮ್ಮಡಹಳ್ಳಿ","lat":12.5602,"lng":76.9302,"has_lift":false,"has_escalator":false,"has_ramp":false,"has_tactile_path":false,"has_accessible_toilet":false},
    {"id":"KOM","name_en":"Kommerahalli","name_kn":"ಕೊಮ್ಮೇರಹಳ್ಳಿ","lat":12.5691,"lng":76.8987,"has_lift":true,"has_escalator":false,"has_ramp":true,"has_tactile_path":true,"has_accessible_toilet":false},
    {"id":"CHM","name_en":"Chikka Mandya","name_kn":"ಚಿಕ್ಕ ಮಂಡ್ಯ","lat":12.5458,"lng":76.8959,"has_lift":true,"has_escalator":false,"has_ramp":true,"has_tactile_path":true,"has_accessible_toilet":false},
    {"id":"GOP","name_en":"Gopalapura","name_kn":"ಗೋಪಾಲಪುರ","lat":12.552,"lng":76.888,"has_lift":false,"has_escalator":false,"has_ramp":false,"has_tactile_path":false,"has_accessible_toilet":false},
    {"id":"KER","name_en":"Keragodu","name_kn":"ಕೆರಗೋಡು","lat":12.6368,"lng":76.9144,"has_lift":true,"has_escalator":true,"has_ramp":true,"has_tactile_path":true,"has_accessible_toilet":true},
    {"id":"HOS","name_en":"Hosahalli","name_kn":"ಹೊಸಹಳ್ಳಿ","lat":12.5536,"lng":76.8712,"has_lift":false,"has_escalator":false,"has_ramp":true,"has_tactile_path":false,"has_accessible_toilet":false},
    {"id":"HOL","name_en":"Holalu","name_kn":"ಹೊಳಲು","lat":12.5528,"lng":76.8502,"has_lift":false,"has_escalator":false,"has_ramp":false,"has_tactile_path":false,"has_accessible_toilet":false},
    {"id":"CHN","name_en":"Chandagalu","name_kn":"ಚಂದಗಾಲು","lat":12.5411,"lng":76.827,"has_lift":false,"has_escalator":false,"has_ramp":false,"has_tactile_path":false,"has_accessible_toilet":false},
    {"id":"SHI","name_en":"Shivalli","name_kn":"ಶಿವಳ್ಳಿ","lat":12.5859,"lng":76.8228,"has_lift":false,"has_escalator":false,"has_ramp":true,"has_tactile_path":false,"has_accessible_toilet":false},
    {"id":"BEV","name_en":"Bevinahalli","name_kn":"ಬೇವಿನಹಳ್ಳಿ","lat":12.4854,"lng":76.8674,"has_lift":false,"has_escalator":false,"has_ramp":false,"has_tactile_path":false,"has_accessible_toilet":false},
    {"id":"KOT","name_en":"Kothathi","name_kn":"ಕೊತ್ತತ್ತಿ","lat":12.4703,"lng":76.8637,"has_lift":false,"has_escalator":false,"has_ramp":true,"has_tactile_path":false,"has_accessible_toilet":true},
    {"id":"MAN","name_en":"Mangala","name_kn":"ಮಂಗಲ","lat":12.4706,"lng":76.9042,"has_lift":true,"has_escalator":true,"has_ramp":true,"has_tactile_path":true,"has_accessible_toilet":true}
  ],
  routes: [
    {"id":"M-GRN","mode":"metro","name_en":"Green Line","name_kn":"ಹಸಿರು ಮಾರ್ಗ","color":"#1b9e4b","low_floor":true,"frequency_min":8},
    {"id":"M-PUR","mode":"metro","name_en":"Purple Line","name_kn":"ನೇರಳೆ ಮಾರ್ಗ","color":"#7b3fa0","low_floor":true,"frequency_min":10},
    {"id":"B-101","mode":"bus","name_en":"Bus 101","name_kn":"ಬಸ್ 101","color":"#d9480f","low_floor":true,"frequency_min":10},
    {"id":"B-102","mode":"bus","name_en":"Bus 102","name_kn":"ಬಸ್ 102","color":"#1971c2","low_floor":false,"frequency_min":20},
    {"id":"B-103","mode":"bus","name_en":"Bus 103","name_kn":"ಬಸ್ 103","color":"#c2255c","low_floor":true,"frequency_min":15},
    {"id":"B-104","mode":"bus","name_en":"Bus 104","name_kn":"ಬಸ್ 104","color":"#5c940d","low_floor":false,"frequency_min":30},
    {"id":"B-105","mode":"bus","name_en":"Bus 105","name_kn":"ಬಸ್ 105","color":"#e67700","low_floor":true,"frequency_min":20},
    {"id":"B-106","mode":"bus","name_en":"Bus 106","name_kn":"ಬಸ್ 106","color":"#0c8599","low_floor":false,"frequency_min":30}
  ],
  route_stops: [
    {"route_id":"M-GRN","seq":1,"stop_id":"TUB","km_from_prev":0,"min_from_prev":0},
    {"route_id":"M-GRN","seq":2,"stop_id":"YEL","km_from_prev":5.3,"min_from_prev":11},
    {"route_id":"M-GRN","seq":3,"stop_id":"IND","km_from_prev":3.3,"min_from_prev":7},
    {"route_id":"M-GRN","seq":4,"stop_id":"PES","km_from_prev":4,"min_from_prev":9},
    {"route_id":"M-GRN","seq":5,"stop_id":"KSR","km_from_prev":2.1,"min_from_prev":5},
    {"route_id":"M-GRN","seq":6,"stop_id":"RLY","km_from_prev":1.5,"min_from_prev":4},
    {"route_id":"M-GRN","seq":7,"stop_id":"GUT","km_from_prev":3.4,"min_from_prev":7},
    {"route_id":"M-GRN","seq":8,"stop_id":"HAN","km_from_prev":10.1,"min_from_prev":20},
    {"route_id":"M-PUR","seq":1,"stop_id":"KER","km_from_prev":0,"min_from_prev":0},
    {"route_id":"M-PUR","seq":2,"stop_id":"KOM","km_from_prev":10,"min_from_prev":20},
    {"route_id":"M-PUR","seq":3,"stop_id":"CHM","km_from_prev":3.4,"min_from_prev":7},
    {"route_id":"M-PUR","seq":4,"stop_id":"SUG","km_from_prev":1.9,"min_from_prev":5},
    {"route_id":"M-PUR","seq":5,"stop_id":"RLY","km_from_prev":0.7,"min_from_prev":2},
    {"route_id":"M-PUR","seq":6,"stop_id":"MAN","km_from_prev":8.6,"min_from_prev":17},
    {"route_id":"B-101","seq":1,"stop_id":"KSR","km_from_prev":0,"min_from_prev":0},
    {"route_id":"B-101","seq":2,"stop_id":"ASH","km_from_prev":1.2,"min_from_prev":5},
    {"route_id":"B-101","seq":3,"stop_id":"MIM","km_from_prev":0.5,"min_from_prev":3},
    {"route_id":"B-101","seq":4,"stop_id":"RLY","km_from_prev":0.6,"min_from_prev":3},
    {"route_id":"B-101","seq":5,"stop_id":"SUG","km_from_prev":0.7,"min_from_prev":3},
    {"route_id":"B-102","seq":1,"stop_id":"KSR","km_from_prev":0,"min_from_prev":0},
    {"route_id":"B-102","seq":2,"stop_id":"PES","km_from_prev":2.1,"min_from_prev":8},
    {"route_id":"B-102","seq":3,"stop_id":"BEV","km_from_prev":4.9,"min_from_prev":17},
    {"route_id":"B-102","seq":4,"stop_id":"KOT","km_from_prev":2.2,"min_from_prev":8},
    {"route_id":"B-103","seq":1,"stop_id":"RLY","km_from_prev":0,"min_from_prev":0},
    {"route_id":"B-103","seq":2,"stop_id":"MIM","km_from_prev":0.6,"min_from_prev":3},
    {"route_id":"B-103","seq":3,"stop_id":"GUT","km_from_prev":3.3,"min_from_prev":12},
    {"route_id":"B-103","seq":4,"stop_id":"UMM","km_from_prev":5.2,"min_from_prev":18},
    {"route_id":"B-103","seq":5,"stop_id":"HAN","km_from_prev":6.9,"min_from_prev":24},
    {"route_id":"B-104","seq":1,"stop_id":"KSR","km_from_prev":0,"min_from_prev":0},
    {"route_id":"B-104","seq":2,"stop_id":"CHM","km_from_prev":2.7,"min_from_prev":10},
    {"route_id":"B-104","seq":3,"stop_id":"GOP","km_from_prev":1.4,"min_from_prev":6},
    {"route_id":"B-104","seq":4,"stop_id":"HOS","km_from_prev":2.4,"min_from_prev":9},
    {"route_id":"B-104","seq":5,"stop_id":"HOL","km_from_prev":3,"min_from_prev":11},
    {"route_id":"B-104","seq":6,"stop_id":"CHN","km_from_prev":3.7,"min_from_prev":13},
    {"route_id":"B-104","seq":7,"stop_id":"SHI","km_from_prev":6.5,"min_from_prev":23},
    {"route_id":"B-105","seq":1,"stop_id":"KSR","km_from_prev":0,"min_from_prev":0},
    {"route_id":"B-105","seq":2,"stop_id":"ASH","km_from_prev":1.2,"min_from_prev":5},
    {"route_id":"B-105","seq":3,"stop_id":"MAN","km_from_prev":7.9,"min_from_prev":27},
    {"route_id":"B-106","seq":1,"stop_id":"PES","km_from_prev":0,"min_from_prev":0},
    {"route_id":"B-106","seq":2,"stop_id":"IND","km_from_prev":4,"min_from_prev":14},
    {"route_id":"B-106","seq":3,"stop_id":"HOL","km_from_prev":5.6,"min_from_prev":20},
    {"route_id":"B-106","seq":4,"stop_id":"HOS","km_from_prev":3,"min_from_prev":11},
    {"route_id":"B-106","seq":5,"stop_id":"GOP","km_from_prev":2.4,"min_from_prev":9},
    {"route_id":"B-106","seq":6,"stop_id":"KOM","km_from_prev":2.9,"min_from_prev":11}
  ],
  fare_slabs: [
    {"mode":"bus","max_km":2,"fare":10},
    {"mode":"bus","max_km":4,"fare":15},
    {"mode":"bus","max_km":6,"fare":20},
    {"mode":"bus","max_km":10,"fare":25},
    {"mode":"bus","max_km":null,"fare":30},
    {"mode":"metro","max_km":2,"fare":10},
    {"mode":"metro","max_km":5,"fare":20},
    {"mode":"metro","max_km":8,"fare":30},
    {"mode":"metro","max_km":null,"fare":40}
  ],
  concessions: [
    {"id":"general","name_en":"General","name_kn":"ಸಾಮಾನ್ಯ","discount_pct":0},
    {"id":"student","name_en":"Student (with ID)","name_kn":"ವಿದ್ಯಾರ್ಥಿ (ಗುರುತಿನ ಚೀಟಿ)","discount_pct":25},
    {"id":"senior","name_en":"Senior citizen (60+)","name_kn":"ಹಿರಿಯ ನಾಗರಿಕರು (60+)","discount_pct":25},
    {"id":"disabled","name_en":"Person with disability","name_kn":"ವಿಕಲಚೇತನರು","discount_pct":50}
  ]
};
