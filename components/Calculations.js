export const ImcCalculation = (weight, height) => {
    return Math.round((weight / (height*height)) * 10) / 10;
}