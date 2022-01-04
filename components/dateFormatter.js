export const formatDate = (date, type) => {
    const data = new Date(date);
    let year = data.getFullYear().toString().substring(2,4);
    let month = data.getMonth()+1;
    let dt = data.getDate();
    let hour = data.getHours();
    let min = data.getMinutes();

    if(year.toString().length==1){
        year = '0'+year;
    }
    if(month.toString().length==1){
        month = '0'+month;
    }
    if(dt.toString().length==1){
        dt = '0'+dt;
    }
    if(hour.toString().length==1){
        hour = '0'+hour;
    }
    if(min.toString().length==1){
        min = '0'+min;
    }

    if (type==1) {
        return `${dt}/${month}/${year} \n${hour}h:${min}min`;
    } else if (type==2){
        return `${dt}/${month}/${year}`;
    }
};