import { useSyncExternalStore } from "react";
import { format } from "date-fns";

function subscribe() {
    return () => {};
}

function getToday() {
    return format(new Date(), "yyyy-MM-dd");
}

function getServerToday() {
    return null;
}

export function useToday() {
    return useSyncExternalStore(subscribe, getToday, getServerToday);
}