import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UseFirestoreDocReturn {
    data: DocumentData | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useFirestoreDoc(
    collectionName: string,
    docId: string
): UseFirestoreDocReturn {
    const [data, setData] = useState<DocumentData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const docRef = doc(db, collectionName, docId);
            const docSnap = await getDoc(docRef);
            setData(docSnap.exists() ? docSnap.data() : null);
        } catch (err) {
            setError('Failed to fetch data');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [collectionName, docId]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { data, isLoading, error, refetch };
}