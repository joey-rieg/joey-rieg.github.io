export function makeInteractive(object, behaviors) {
    object.userData = object.userData || {};
    
    Object.assign(object.userData, behaviors);
    
    object.userData.isInteractive = true;
    
    return object;
}