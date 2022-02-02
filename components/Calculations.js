export const ImcCalculation = (weight, height) => {
    return Math.round((weight / (height*height)) * 10) / 10;
}

export const getInsulinToTake = (minGlucose, maxGlucose, carbohydrates, glucoseLevel, weight, lastRecordDate, lastInsulinIntake) => {
    let insulinToTake;

    if (minGlucose > glucoseLevel) {
        insulinToTake = 'Hypoglycemia, ingest carbohydrates';
        return {message: insulinToTake, doses: 0};
    }

    const dataHora = new Date(lastRecordDate);

    let today = new Date();
    let diff = today - dataHora;
    let diffMins = Math.floor((diff / 1000) / 60 );
    let periods = diffMins / 10;
    let insAtiva = 0;
    let isAnyActiveInsulin = false;

    if(periods < 24){
        insAtiva = lastInsulinIntake - periods*(lastInsulinIntake/24);
        isAnyActiveInsulin = true;
    }

    let carbsDosesToFix = Math.round(carbohydrates / 10);
    let glucoseDosesToFix = 0;

    if(maxGlucose < glucoseLevel) {
        glucoseDosesToFix = Math.round((glucoseLevel-maxGlucose) / 40);
        insulinToTake = `Hyperglycemia, insert `
    }

    let amountOfDoses = Math.ceil(carbsDosesToFix + glucoseDosesToFix - insAtiva);
    if(isAnyActiveInsulin){
        insulinToTake = `Since you have ${insAtiva.toFixed(2)} doses active in your body, you needed ${glucoseDosesToFix} doses to fix your glucose levels and ${carbsDosesToFix} doses to compensate your cardbohydrates levels.\nIn total you need ${amountOfDoses} doses`;
        if(amountOfDoses <= 0){
            insulinToTake = `Since you have ${insAtiva.toFixed(2)} doses active in your body, you won't be needing any aditional doses`;
        }
    } else {
        insulinToTake = `You need ${glucoseDosesToFix} doses to fix your glucose levels and ${carbsDosesToFix} doses to compensate your cardbohydrates levels.\n\nIn total you need ${amountOfDoses} doses`;
    }
    

    return {message: insulinToTake, doses: amountOfDoses};
}

export const getHC = (foods, weight) => {
    let today = new Date();
    let filteredFoods = foods.filter(function(food){
        let foodDate = new Date(food.dataHora);
        let diff = today - foodDate;
        let diffHours = Math.floor((diff / 1000) / (60*60) );
        return diffHours < 20;
    })

    let totalCarbs = 0;
    filteredFoods.forEach(element => {
        totalCarbs += parseFloat(element.qtHidratos);
    });

    let maxCarbs = weight*4;
    let availableCarbs = maxCarbs-totalCarbs;

    return {maxCarbs: maxCarbs, availableCarbs: availableCarbs, totalCarbs: totalCarbs};
}