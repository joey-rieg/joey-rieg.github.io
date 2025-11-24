
export class Flicker {
    #lights = [];
    #isOn = false;
    #intervalId = null;

    addLight(light) {
        this.#lights.push(light);
    }
    
    startFlicker() {
        if (this.#isOn) return;
        
        this.#isOn = true;
        
        this.#intervalId = setInterval(this.#performFlicker.bind(this), 200);
    }
    
    stopFlicker() {
        if (this.#intervalId == null) return;
        
        clearInterval(this.#intervalId);
        this.#intervalId = null;
        
        this.#isOn = false;
    }
    
    #performFlicker() {
        {
            let intensity = 1.0;
            if (Math.random() < 0.2) {
                intensity = 0.2;
            }
            
            this.#lights.forEach(light => light.intensity = intensity);
        }
    }
}