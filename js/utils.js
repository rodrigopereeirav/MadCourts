function superLimpieza(txt, tipo) {
    if (!txt) return null;
    let soloNumeros = String(txt).replace(/[^-0-9]/g, '');
    if (tipo === 'lat') {
        if (soloNumeros.startsWith('40')) return parseFloat('40.' + soloNumeros.substring(2));
        if (soloNumeros.startsWith('4')) return parseFloat('40.' + soloNumeros.substring(1));
    } else {
        let puro = soloNumeros.replace('-', '');
        if (puro.startsWith('3')) return -parseFloat('3.' + puro.substring(1));
    }
    return null;
}
