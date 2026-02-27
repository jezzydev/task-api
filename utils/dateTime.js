const formatDate = (dateObj) => {
    return [
        dateObj.getFullYear(),
        String(dateObj.getMonth() + 1).padStart(2, '0'),
        String(dateObj.getDate()).padStart(2, '0'),
    ].join('-');
};

const formatTime = (dateObj) => {
    return [
        String(dateObj.getHours()).padStart(2, '0'),
        String(dateObj.getMinutes()).padStart(2, '0'),
        String(dateObj.getSeconds()).padStart(2, '0'),
    ].join(':');
};

const isValidFormat = (dateStr) => {
    const dateRegx = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/; //yyyy-mm-dd
    return dateRegx.test(dateStr);
};

const isValidDate = (dateStr) => {
    //assumes dateStr is in correct format: yyyy-mm-dd
    const parts = dateStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const date = new Date(year, month, day);
    return (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
    );
};

module.exports = { formatDate, formatTime, isValidFormat, isValidDate };
