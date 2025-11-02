function tannberg_layers() {

    var tannberg_wichtige_orte = L.layerGroup([
        marker([-150,-400], "Spawn", "spawn"),
        marker([-141,-412], "Farmwelt", "farmwelt"),
        marker([-132,-405], "Bahnhof Tannenwald", "zug"),

        marker([-212,-367], "Nordkreuzplatz", "weihnachtsbaum"),
        marker([-390,-222], "Gemeindezentrum", "rathaus"),
        marker([-300,-291], "Detektei K&E", "detektei"),
        marker([-342,-270], "Phil's Hofladen", "shop"),
        marker([-147,-266], "Modde's Partykeller", "bowling"),
        marker([-333,-143], "Pferdeverkauf", "shop"),

        marker([34,-80], "Nordbahnhof", "zug"),
        marker([-24,-241], "Haltepunkt Oberdorf", "zug"),
        marker([-453,-100], "Ostbahnhof", "zug"),
        marker([-280,-565], "Westbahnhof", "zug"),

        marker([-471,-530], "Fuchsspitze", "berg"),
        marker([-457,-427], "Gondelstation", "gondel"),
        marker([-457,-120], "Gondelstation", "gondel"),

        marker([-401,-144], "Adventskalender", "weihnachtsbaum"),
        marker([-417,-103], "Hutladen", "shop"),
        marker([-418,-131], "Luki's Kellogsstube", "shop"),
        marker([-396,-96], "Models & More", "shop"),
        marker([-373,-44], "RefSport", "shop"),
        marker([-381,-37], "Rathaus", "rathaus")
    ]);

    var tannberg_spieler = L.layerGroup([
        marker([-241,-369], "lunofe"),
        marker([-253,-351], "zeitspiel"),
        marker([-237,-400], "Choco & JuleMC"),
        marker([-209,-439], "Tenou"),
        marker([-235,-458], "byFiliz"),
        marker([-266,-460], "ScottMcKey"),
        marker([-314,-448], "ZenterZyon"),
        marker([-269,-521], "Q6167"),
        marker([-221,-522], "CalamarisHD & thilthil"),
        marker([-201,-488], "Maxloe"),
        marker([-221,-331], "Schluckspecht"),
        marker([-271,-313], "SeeYaJDS"),
        marker([-271,-284], "AlbertAllrad"),
        marker([-319,-297], "KinqPhilippHD & enricol0l"),
        marker([-303,-261], "No_MajLP"),
        marker([-333,-266], "bergmaenchen"),
        marker([-365,-295], "Rayleth621"),
        marker([-361,-268], "AndreSpeed"),
        marker([-354,-326], "tabsibea & Danny_ow"),
        marker([-376,-338], "Adolar0042 & Mineslime"),
        marker([-332,-388], "EinWildesPika"),
        marker([-404,-335], "Aveil"),
        marker([-394,-306], "GandalfLP"),
        marker([-195,-402], "aemo0n"),
        marker([-400,-269], "jakobjr"),
        marker([-358,-223], "KptnZurSee"),
        marker([-357,-197], "Alpha_Schneemann"),
        marker([-332,-124], "NetFX92 & BeastBugBoy"),
        marker([-176,-347], "MalleDe99"),
        marker([-244,-289], "Mytra"),
        marker([-218,-279], "fiiini"),
        marker([-163,-314], "ParzevallSprout"),
        marker([-212,-203], "MaximusOktopus"),
        marker([-137,-253], "ModdeAT"),
        marker([-96,-255], "HalbVampir"),
        marker([-60,-274], "Niki1i506"),
        marker([-4,-339], "Ironwaffel"),
        marker([-70,-400], "troyoyal"),
        marker([-91,-356], "Blindus"),
        marker([-124,-651], "scaryta"),
        marker([28,-621], "rene5001000"),
        marker([10,-428], "weronr"),
        marker([383,405], "The_T0m2k"),
        marker([-132,-475], "Dark_cookielord"),
        marker([-321,-233], "Felix_Schriever"),
        marker([-261,-129], "BananeKirsch"),
        marker([-604,228], "Schluckspecht"),
        marker([-683,203], "larachen_nom"),
        marker([-719,236], "Eltonoo"),
        marker([-759,141], "MaxH667"),
        marker([-629,298], "Chunker"),
        marker([-708,309], "PAEAET"),
        marker([-289,-30], "Schwaewe"),
        marker([-323,-37], "EinKuenstler"),
        marker([-316,-88], "Ironwaffel"),
        marker([-341,-90], "mchawk2001"),
        marker([-330,-169], "Nicostar3000, Yodie & finn_ost"),
        marker([-430,-234], "BananaPizz"),
        marker([-95,-221], "Mooshroomhead"),
        marker([-125,-323], "Cuz_Im_Sarah"),
        marker([-235,-617], "heaasy"),
        marker([-197,-666], "Flunggi"),
        marker([-323,-608], "7Justin"),
        marker([-289,-225], "zGecco"),
        marker([243,-279], "Mytra"),
        marker([147,-51], "NaxoG"),
        marker([-246,-317], "lPingu"),
        marker([-334,-296], "ParzevallSprout"),
        marker([-275,379], "Beautiful Botte Clan")
    ]);

    var tannberg_strecken = L.layerGroup([
        // Gondel
        linie("#BC3220", [[-457,-427],[-457,-120]], "1,5"),
        // Schlitten
        marker([-482,-427], "Strecke Gipfelmulde", "schlitten"),
        kurve("#43BCBA", [[-482,-427],[-499,-388],[-522,-372],[-546,-343],[-573,-326],[-596,-295],[-581,-279],[-563,-279],[-518,-299],[-495,-297],[-460,-250],[-457,-220],[-448,-200],[-427,-180]]).bindPopup("Strecke Gipfelmulde"),
        marker([-486,-432], "Strecke Fuchsloch", "schlitten"),
        kurve("#F4A300", [[-486,-432],[-502,-404],[-528,-397],[-552,-390],[-576,-360],[-599,-339],[-600,-295],[-585,-275],[-563,-267],[-557,-252],[-574,-241],[-607,-201],[-607,-182],[-627,-150],[-662,-152],[-667,-135],[-666,-115],[-646,-91],[-627,-69],[-615,-70],[-589,-94],[-562,-105],[-551,-131],[-531,-170],[-518,-190],[-462,-205],[-452,-200],[-432,-177]]).bindPopup("Strecke Fuchsloch"),
        // BBC
        linie("#365083", [[-275,101],[-275,342]], "1,5"),
        // Zugtunnel
        kurve("black", [[-77,-538],[-97,-557],[-164,-556]], "1,5"),
        kurve("black", [[-132,-405],[-128,-417],[-104,-430],[-71,-442],[-66,-450]], "1,5"),
        kurve("black", [[-132,-405],[-124,-366],[-101,-353],[-81,-340],[-62,-333]], "1,5"),
        kurve("black", [[-35,-338],[-28,-329],[5,-266]], "1,5"),
        kurve("black", [[-156,17],[-212,45],[-221,32],[-226,8],[-223,-9],[-230,-19]], "1,5"),
        kurve("black", [[-448,-101],[-470,-101],[-476,-104],[-481,-107]], "1,5")
    ]);

    return [
        L.control.layers(null, { "Wichtige Orte": tannberg_wichtige_orte, "Spieler": tannberg_spieler, "Strecken": tannberg_strecken }),
        tannberg_wichtige_orte,
        tannberg_spieler,
        tannberg_strecken
    ];
}
