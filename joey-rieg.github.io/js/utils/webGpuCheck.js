const webGpuAvailabilityPromise = (async () => {
    if (!navigator.gpu)
        return false;
    
    const adapter = await navigator.gpu.requestAdapter();
    return !!adapter;
    
})();

export async function isWebGpuAvailable()
{
    return webGpuAvailabilityPromise;
}
