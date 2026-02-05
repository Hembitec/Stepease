import { flwRequest } from "./auth";

interface TransactionVerifyResponse {
    status: string;
    message: string;
    data: {
        id: number;
        tx_ref: string;
        flw_ref: string;
        amount: number;
        currency: string;
        charged_amount: number;
        status: string;
        payment_type: string;
        customer: {
            id: number;
            email: string;
            name: string;
        };
        created_at: string;
    };
}

/**
 * Verify a transaction by ID
 * This is called after webhook to double-check transaction status
 */
export async function verifyTransaction(
    transactionId: string | number
): Promise<TransactionVerifyResponse> {
    return flwRequest<TransactionVerifyResponse>(
        `/transactions/${transactionId}/verify`
    );
}

/**
 * Verify a transaction by tx_ref
 */
export async function verifyTransactionByRef(
    txRef: string
): Promise<TransactionVerifyResponse> {
    return flwRequest<TransactionVerifyResponse>(
        `/transactions/verify_by_reference?tx_ref=${encodeURIComponent(txRef)}`
    );
}
