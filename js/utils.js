var utils = (() => {
    const parseFecha = (stringFecha, withHour = false) => {
        if (typeof stringFecha === "undefined") return "00/00/0000";
        const fecha = new Date(stringFecha);
        let newFormat = `${stringFecha.slice(8,10)} de ${_arrayMonths[fecha.getMonth()]} del ${fecha.getFullYear()}`;
        if (withHour) {
            newFormat += ` a las ${fecha.getHours()}:${fecha.getMinutes()}`;
        }
        return newFormat
    }

    const _arrayMonths = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const aplyFormatNumeric = (numberString) => {
        if (numberString === null || typeof numberString === "undefined" || numberString.trim().length <= 2) return;
        const arrayDivision = numberString.split(".");
        let numberFormated = "00,000.000";
        const lengthPartInt = arrayDivision[0].length;
        const sobrantes = ((lengthPartInt)%3);
        let contadorSecundario = 1;
        numberFormated = arrayDivision[0].split("").reduce((acumulador, numero, indice) => {
            acumulador.push(numero);
            if(indice === (sobrantes-1) && indice < (lengthPartInt-1)) acumulador.push(",");
            if (indice >= sobrantes && indice < (lengthPartInt-1)) {
                if ((contadorSecundario)%3 === 0) {
                    acumulador.push(",");
                }
                contadorSecundario++;
            }
            return acumulador;
        },[]);
        numberFormated = numberFormated.join("");
        if (arrayDivision.length === 2) {
            numberFormated += `.${arrayDivision[1]}`;
        }
        console.log(numberString, numberFormated);
        return numberFormated;
    }

    const roundTo = (number, digits = 2, autoComplete = false) => { //12411.95368 , 3, false
        const stringNumber = (number === null || number === undefined) ? "0" : number.toString();
        const arrayDivision = stringNumber.split(".");
        const lengthDivision = arrayDivision.length;
        let rounded = "0.00";
        let digitsString = "";
        if (lengthDivision === 1) {
            if (!autoComplete) return arrayDivision[0];

            for (let index = 0; index < digits; index++) {
                digitsString += "0"
            }
            rounded = arrayDivision[0] + "." +digitsString;
            return rounded;
        }
        if (digits === 0) {
            rounded = Math.round(number);
            return rounded;
        }
        digitsString = arrayDivision[1].slice(0, (digits - 1));
        let digitToRound = parseInt(arrayDivision[1].slice(digits, (digits + 1)));
        if (isNaN(digitToRound)) digitToRound = 0;
        let digitRounded = -1;
        if (digitToRound < 5) digitRounded = arrayDivision[1].slice((digits - 1), digits);
        if (digitToRound >= 5 && digitToRound < 9) digitRounded = parseInt(arrayDivision[1].slice((digits - 1), digits)) + 1;
        if (digitToRound == 9) digitRounded = 9;
        rounded = arrayDivision[0] + "." + digitsString + digitRounded;
        return rounded;
    }

    return {
        parseFecha,
        roundTo,
        aplyFormatNumeric
    }
})()