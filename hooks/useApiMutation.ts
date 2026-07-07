import { useState, useCallback } from 'react';

type Method = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface UseApiMutationReturn<T> {
    mutate: (data?: T, overrideEndpoint?: string) => Promise<boolean>;
    isLoading: boolean;
    error: string | null;
}

export function useApiMutation<T = Record<string, unknown>>(
    endpoint: string,
    method: Method = 'POST'
): UseApiMutationReturn<T> {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mutate = useCallback(async (data?: T, overrideEndpoint?: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(overrideEndpoint ?? endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: data ? JSON.stringify(data) : undefined,
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            return true;
        } catch (err) {
            setError('Operation failed');
            console.error(err);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [endpoint, method]);

    return { mutate, isLoading, error };
}