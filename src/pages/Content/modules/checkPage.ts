const checkPage = () => {
    const style = Array.from(document.styleSheets)
        .filter(
            sheet => sheet.href && /\/themes\/[^\/]+\/variables(?:\.[a-f0-9]+)?\.css$/.test(sheet.href || '')
        );
    return !!style.length;
}

export default checkPage;