class Vortex {
    private sliderValue: number;
    private slider: HTMLInputElement;
    constructor(height: number, width: number) {
        let slider = document.getElementById("sliderRange");
        let output = document.getElementById('currentSliderValue');
        let sliderValue = this.slider.value;
        output.innerHTML = sliderValue;
    }
    
}