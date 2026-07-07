import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    collection, getDocs, query,
    orderBy, DocumentData, QueryConstraint
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UseFirestoreCollectionReturn {
    data: (DocumentData & { id: string })[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    total: number;
}

export function useFirestoreCollection(
    collectionName: string,
    orderByField?: string
): UseFirestoreCollectionReturn {
    const [data, setData] = useState<(DocumentData & { id: string })[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const constraints: QueryConstraint[] = [];
            if (orderByField) constraints.push(orderBy(orderByField));
            const q = query(collection(db, collectionName), ...constraints);
            const snapshot = await getDocs(q);
            const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
            setData(docs);
        } catch (err) {
            setError('Failed to fetch collection');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [collectionName, orderByField]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    // useMemo لحساب العدد الكلي بدون إعادة حساب
    const total = useMemo(() => data.length, [data]);

    return { data, isLoading, error, refetch, total };
}