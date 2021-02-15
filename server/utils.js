const currentDateFormatted = () => {
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date().toString().split(' ');
    return `${date[3]}-${month.indexOf(date[1])}-${date[2]}`;
}

module.exports = {
    currentDateFormatted,
}
