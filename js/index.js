var app = new Vue({
    el: "#app",
    data: {
        articulos: [],
        movil: false,
        articulo: {},
        showDetails: false,
        uri: "NoFind",
        nameBody: "collapseOne",
        loading: false,
        textSearch: "",
        finded: 0,
        NumSearch: 0,
        NumSearchProducts: 0,
        titleAlert: "Advertencia",
        messageAlert: "",
        /** Variables no publicas para conexiones**/
        urlApiExistencias: "",
        namesSucursales: {nameSuc1: "ZARAGOZA", nameSuc2: "VICTORIA", nameSuc3: "OLUTA", nameSuc4: "BODEGA", nameSuc5: "JALTIPAN"}
    },
    mounted: function(){
        this.movil = this.isDiplayMovil();
        this.getLocalStorage();
    },
    methods: {
        showAlertDialog: function(message) {
            this.messageAlert = message;
            document.getElementById("btnAlert").click();
        },
        parseToPorcent: function(value) { // 0.45
            const stringValue = value.toString();
            const arrayValue = stringValue.split(".");
            return parseInt(arrayValue[1]);
        },
        count: function(anyObject) {
            const length = (Object.keys(anyObject)).length;
            return length;
        },
        setArticulosLocalStorage: function(articulos, NumSearchProducts, finded) {
            const stringArticulos = JSON.stringify(articulos);
            localStorage.setItem("articulosexistencias", stringArticulos);
            localStorage.setItem("nsearchexistencias", NumSearchProducts);
            localStorage.setItem("findedchexistencias", finded);
        },
        setDetailsLocalStorage: function(articulo, NumSearch) {
            const stringArticulos = JSON.stringify(articulo);
            localStorage.setItem("articuloexistencias", stringArticulos);
            localStorage.setItem("searchexistencias", NumSearch);
        },
        getLocalStorage: function() {
            const stringArticulos = localStorage.getItem("articulosexistencias");
            const stringArticulo = localStorage.getItem("articuloexistencias");

            this.articulos = JSON.parse(stringArticulos);
            this.NumSearchProducts = parseInt(localStorage.getItem("nsearchexistencias"));
            this.finded = parseInt(localStorage.getItem("findedchexistencias"));

            this.articulo = JSON.parse(stringArticulo);
            this.NumSearch = parseInt(localStorage.getItem("searchexistencias"));
        },
        getArticulos: function() {
            if (this.textSearch.trim() === "") {
                this.showAlertDialog("Campo de busqueda vacio");
                return;
            }
            this.startLoading();
            const instancia = this;
            const urlConsulta = `${this.urlApiExistencias}${this.textSearch}`;
            axios.get(urlConsulta)
            .then(function (response) {
                if (response.data.data === null) {
                    instancia.articulos = [];
                    instancia.NumSearchProducts += 1;
                    instancia.finded = 0;
                    instancia.stopLoading();
                    instancia.showAlertDialog("No hay conexion con la base de datos");
                    instancia.setArticulosLocalStorage(instancia.articulos, instancia.NumSearchProducts, instancia.finded);
                    return;
                }
                instancia.articulos = response.data.data;
                instancia.stopLoading();
                instancia.NumSearchProducts += 1;
                instancia.finded = response.data.count;
                instancia.setArticulosLocalStorage(instancia.articulos, instancia.NumSearchProducts, instancia.finded);
            })
            .catch(function (error) {
                instancia.articulos = [];
                instancia.stopLoading();
                instancia.NumSearchProducts += 1;
                instancia.finded = 0;
                instancia.showAlertDialog("Error inesperado: No hay conexion con el servidor");
                instancia.setArticulosLocalStorage(instancia.articulos, instancia.NumSearchProducts, instancia.finded);
                console.log('Error: ' + error);
            }); 
        },
        getDetailsArticulo: function(urlDetails) {
            this.startLoading();
            const instancia = this;
            axios.get(urlDetails)
            .then(function (response) {
                if (response.data.data === null) {
                    instancia.articulo = [];
                    instancia.showDetails = true;
                    instancia.stopLoading();
                    instancia.showAlertDialog("No hay conexion con la base de datos");
                    instancia.setDetailsLocalStorage([], instancia.NumSearch);
                    return;
                }
                instancia.articulo = response.data.data;
                instancia.stopLoading();
                instancia.showDetails = true;
                instancia.NumSearch += 1;
                instancia.setDetailsLocalStorage(instancia.articulo, instancia.NumSearch);
            })
            .catch(function (error) {
                instancia.articulo = {
                    Articulo: "",
                    Nombre: "",
                    Relacion: "",
                    ExistActualUC: null,
                    Stock30UC: null,
                    CostoExistActual: null,
                    existencias: []
                };
                instancia.setDetailsLocalStorage(instancia.articulo, instancia.NumSearch);
                instancia.stopLoading();
                instancia.showDetails = true;
                instancia.showAlertDialog("Error inesperado: No hay conexion con el servidor");
                console.log('Error: ' + error);
            });
        },
        isDiplayMovil: function() {
            if (screen.width > 800) return false;
            return true;
        },
        startLoading: function() {
            this.loading = true;
        },
        stopLoading: function() {
            this.loading = false;
        },
        setUri: function(uri) {
            this.showDetails = true;
            this.uri = uri
            console.log("uri",(uri));
        },
        backMain: function() {
            this.showDetails = false;
        },
        goDetails: function() {
            this.showDetails = true;
        }
    },
    computed: {
        ariculoRefactor() {
            if (Object.values(this.articulo).length > 0) {
                const existenciasRefactor = this.articulo.existencias.map((sucursal) => {
                    if (typeof sucursal.compras !== "object") {
                        sucursal.compras = {}
                    };
                    return sucursal;
                });
                this.articulo.existencias = existenciasRefactor;
            }
            return this.articulo;
        }
    }
});