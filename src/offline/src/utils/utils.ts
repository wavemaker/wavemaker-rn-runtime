export const WM_LOCAL_OFFLINE_CALL = 'WM_LOCAL_OFFLINE_CALL';

export const escapeName = (name: string) => {
    if (name) {
        name = name.replace(/"/g, '""');
        return '"' + name + '"';
    }
    return name;
};
