"use client"

import { scanReceipt } from "@/actions/transaction";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { Camera, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const ReceiptScanner = ({ onScanComplete }) => {
    const fileInputRef = useRef(null);
    const [
        scannedData,
        scanReceiptLoading,
        scanReceiptError,
        scanReceiptFn,
    ] = useFetch(scanReceipt);

    const handleReceiptScan = async(file) => {
        if(file.size > 5*1024*1024){
        toast.error("file size exceeds the limit")
        return;
        }
        
        await scanReceiptFn(file);
    };
    useEffect(() => {
        if(scannedData && !scanReceiptLoading ){
            onScanComplete(scannedData);
            toast.success("Receipt scanned successfully");
        }
    },[
        scannedData,
        scanReceiptLoading,  
    ]);

    useEffect(() => {
        if (scanReceiptError) {
            toast.error(scanReceiptError.message || "Failed to scan receipt");
        }
    }, [scanReceiptError]);



    return(
        <div>
            <input ref={fileInputRef}
            type="file"
            accept="image/*"
            capture = "environment"
            className="hidden"
            onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                    handleReceiptScan(file);
                }
            }}
            />
            <Button onClick={() => fileInputRef.current?.click()} disabled={scanReceiptLoading} className="flex items-center">
                {scanReceiptLoading ?(
                <>
                <Loader2 className="mr-2 animate-spin"/>
                <span className="ml-2">Scanning...</span>
                </>
                ):(
                <>
                <Camera/>
                <span className="ml-2">Scan Receipt</span>
                </>)}
            </Button>

        </div>)
        

    
};
export default ReceiptScanner;
