export const handleViewModeSwitch = (currViewMode, viewModes) => {
    const i = viewModes.findIndex((e) => e == currViewMode);
    const nextI = i < viewModes.length - 1 ? i + 1 : 0;
    return viewModes[nextI];
}