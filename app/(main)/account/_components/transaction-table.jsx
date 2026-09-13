"use client"
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from '@/components/ui/checkbox'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import useFetch from '@/hooks/use-fetch'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { format } from 'date-fns'
import { ChevronDown, ChevronUp, Clock, RefreshCw, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { BarLoader } from 'react-spinners'
import { toast } from 'sonner'
import { categoryColors } from '../../../../data/categories'
import { BulkDelete } from "@/actions/accounts"

const RECURRING_INTERVALS = {
    DAILY :"Daily",
    WEEKLY : "Weekly",
    MONTHLY : "Monthly",
    YEARLY : "Yearly",
    
}

const ITEMS_PER_PAGE = 10;

const TransactionTable = ({transactions}) => {

const router = useRouter();
const [isHovered, setIsHovered] = useState(false);

    const [selectedIds, setSelectedIds] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        field:"date",
        direction:"desc",
    });

    const[searchTerm, setSearchTerm] = useState("");
    const[dateFilter, setDateFilter] = useState("");
    const[repeatFilter, setRepeatFilter] = useState("ALL");
    const[typeFilter, setTypeFilter] = useState("ALL");
    const[categoryFilter, setCategoryFilter] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);

    const handlefilter = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        
        return (transactions || [])
            .filter((transaction) => {
                const matchesSearch = normalizedSearch
                    ? [
                        transaction.description,
                        transaction.category,
                        transaction.type,
                    ].some((value) =>
                        value?.toString().toLowerCase().includes(normalizedSearch)
                    )
                    : true;
                // For date filter, we check if the transaction date matches the selected date
                const matchesDate = dateFilter
                    ? format(new Date(transaction.date), 'yyyy-MM-dd') === dateFilter
                    : true;
                const matchesType = typeFilter === "ALL" || transaction.type === typeFilter;
                const matchesRepeat = repeatFilter === "ALL"
                    || (repeatFilter === "RECURRING" && transaction.isRecurring)
                    || (repeatFilter === "ONE-TIME" && !transaction.isRecurring);
                const matchesCategory = categoryFilter === "ALL" || transaction.category === categoryFilter;

                return matchesSearch && matchesDate && matchesType && matchesRepeat && matchesCategory;
            })
            // sorting 
            .sort((a, b) => {
                if (sortConfig.field === "date") {
                    return sortConfig.direction === "asc"
                        ? new Date(a.date) - new Date(b.date)
                        : new Date(b.date) - new Date(a.date);
                }
                    // For amount, we sort numerically
                if (sortConfig.field === "amount") {
                    return sortConfig.direction === "asc"
                        ? a.amount - b.amount
                        : b.amount - a.amount;
                }
                // For category, we sort alphabetically
                if (sortConfig.field === "category") {
                    return sortConfig.direction === "asc"
                        ? a.category.localeCompare(b.category)
                        : b.category.localeCompare(a.category);
                }

                return 0;
            });
    }, [
        searchTerm,
        dateFilter,
        repeatFilter,
        typeFilter,
        categoryFilter,
        transactions,
        sortConfig,
    ]);

    const totalPages = Math.ceil(handlefilter.length / ITEMS_PER_PAGE);
    const activePage = Math.min(currentPage, totalPages || 1);
    
    const paginatedTransactions = useMemo(() => {
        const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
        return handlefilter.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [handlefilter, activePage]);

   const [deleteData, deleteLoading, deleteError, deletefn] = useFetch(BulkDelete)

   const handleBulkDelete= async()=>{
    if(
        !window.confirm(`Are you sure you want to delete ${selectedIds.length} transactions? This action cannot be undone.`)
    ){
        return;
    }
    deletefn(selectedIds);
    };
    
    useEffect(() => {
        if(deleteData && !deleteLoading){
            toast.success("Transactions deleted successfully");

        }}, [deleteData, deleteLoading])

    useEffect(() => {
        if(deleteError){
            toast.error(deleteError || "Failed to delete transactions");
        }
    }, [deleteError]);

    
    const handleclearFilters=()=>{
        setSearchTerm("");
        setDateFilter("");
        setRepeatFilter("ALL");
        setTypeFilter("ALL");
        setCategoryFilter("ALL");
        setSelectedIds([]);
        setCurrentPage(1);
    }


    const handleSort=(field)=>{
        setSortConfig (current => ({
            field,
            direction: current.field === field && current.direction === "asc" ? "desc" : "asc",

        }))
        
    };
    

    const handleSelectAll=()=>{
        const currentIds = paginatedTransactions.map((t) => t.id);
        const isAllSelected = currentIds.every((id) => selectedIds.includes(id));
        
        if (isAllSelected) {
            setSelectedIds((current) => current.filter((id) => !currentIds.includes(id)));
        } else {
            setSelectedIds((current) => {
                const newIds = [...current];
                currentIds.forEach((id) => {
                    if (!newIds.includes(id)) newIds.push(id);
                });
                return newIds;
            });
        }
    }
  


  return (
    <div className='finance-section space-y-4'>
        {deleteLoading && <BarLoader width={"100%"} color="#ef4444" />}


        {/* filter*/}
        <div className= "space-y-4">
            <div className='flex flex-col gap-3 lg:flex-row lg:items-center'>
                <Select value={typeFilter} onValueChange={(value)=> setTypeFilter(value)}>
                    <SelectTrigger className="w-full border-blue-200 bg-blue-50/70 lg:w-[150px]">
                            <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="INCOME">INCOME</SelectItem>
                            <SelectItem value="EXPENSE">EXPENSE</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select value={repeatFilter} onValueChange={(value)=> setRepeatFilter(value)}>
                    <SelectTrigger className="w-full border-emerald-200 bg-emerald-50/70 lg:w-[150px]">
                            <SelectValue placeholder="All Transactions" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="ALL">ALL</SelectItem>
                            <SelectItem value="RECURRING">RECURRING</SelectItem>
                            <SelectItem value="ONE-TIME">ONE-TIME</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <div className='relative flex-1'>
                    <Search className='absolute h-4 w-4 left-2 top-1/2 -translate-y-1/2 text-muted-foreground'/>
                    <Input placeholder='Search transactions...'
                    value={searchTerm}
                    onChange={(e)=> setSearchTerm(e.target.value)}
                    className='pl-8'
                    />
                </div>
                {selectedIds.length > 0 && <div className='ml-auto flex items-center gap-2'>
                    <span className='text-sm text-muted-foreground'>{selectedIds.length} Delete selected</span>
                    <button
                        type='button'
                        className={`${buttonVariants({ variant: 'destructive', size: 'lg' })} flex items-center justify-center gap-2 px-4 py-3 min-w-[110px]`}
                        onClick={handleBulkDelete}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {isHovered ? (
                            <DotLottieReact
                                key={isHovered}
                                src="https://lottie.host/d85f31e8-cf3b-4f3b-9adc-bf704428ad3f/p5BMKc8aKa.lottie"
                                loop={false}
                                autoplay={true}
                                style={{ width: '50px', height: '700px' }}
                            />
                        ) : (
                            'Delete'
                        )}
                    </button>    
                </div>}
                {(searchTerm|| typeFilter !== "ALL" || repeatFilter !== "ALL") && (
                    <button
                        type='button'
                        className={`${buttonVariants({ variant: 'outline', size: 'lg' })} flex items-center justify-center gap-2 px-4 py-3 min-w-[110px] ml-auto`}
                        onClick={handleclearFilters} title="Clear Filters"
                    >
                        Clear Filters
                        
                    </button>)}
            </div>
        </div>

        {/* transactions */}
        <div className='overflow-hidden rounded-xl border border-slate-200 bg-white/90 shadow-sm'>
            <Table>
                
                <TableHeader className="bg-slate-950">
                    <TableRow className="hover:bg-slate-950">
                        
                        <TableHead className="w-[50px] text-white">
                            <Checkbox 
                                onCheckedChange={handleSelectAll}
                                checked={paginatedTransactions.length > 0 && paginatedTransactions.every(t => selectedIds.includes(t.id))}
                                indeterminate={paginatedTransactions.some(t => selectedIds.includes(t.id)) && !paginatedTransactions.every(t => selectedIds.includes(t.id))}
                            />
                        </TableHead>
                                                            {/* Date   */}

                        <TableHead className="cursor-pointer text-white" onClick={()=> handleSort("date")}>
                            <div className="flex items-center">
                                Date
                                    {sortConfig.field === "date" &&
                                        (sortConfig.direction === "asc" ? (
                                        <ChevronUp className='ml-1 h-4 w-4'/> 

                                    ):( 
                                        <ChevronDown className='ml-1 h-4 w-4'/>
                            
                                    ))}
                            </div>
                        </TableHead>

                                                        {/* Description   */}

                        <TableHead className="text-white">Description</TableHead>

                                                            {/* Category   */}
                        <TableHead className="cursor-pointer text-white" onClick={()=> handleSort("category")}>
                            <div className="flex items-center">
                                Category
                                    {sortConfig.field === "category" &&
                                        (sortConfig.direction === "asc" ? (
                                        <ChevronUp className='ml-1 h-4 w-4'/> 

                                    ):( 
                                        <ChevronDown className='ml-1 h-4 w-4'/>
                            
                                    ))}


                            </div>
                            
                        {/* Amount   */}
                        </TableHead>
                        <TableHead className="cursor-pointer text-white" onClick={()=> handleSort("amount")}>
                            <div className="flex items-center justify-end">
                                Amount

                                {sortConfig.field === "amount" &&
                                (sortConfig.direction === "asc" ? (
                                    <ChevronUp className='ml-1 h-4 w-4'/> 

                                ):( 
                                    <ChevronDown className='ml-1 h-4 w-4'/>
                            
                                ))}

                            </div>
                        </TableHead>

                        {/* Repeating */}
                        <TableHead className="text-white">
                            <div className='text-center'>Repeating</div>
                        </TableHead>
                        <TableHead className="w-[50px]" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedTransactions.length === 0 ?(
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground">
                        
                                No transactions Found
                            </TableCell>
                        </TableRow>
                        ):(
                            paginatedTransactions.map((transaction) => (

                            <TableRow key={transaction.id} className="hover:bg-emerald-50/60">
                                <TableCell className="font-medium">
                                    <Checkbox 
                                        onCheckedChange={(checked) => setSelectedIds(prev => checked ? [...prev, transaction.id] : prev.filter(id => id !== transaction.id))}
                                        checked={selectedIds.includes(transaction.id)}
                                    />
                                </TableCell>
                                <TableCell>{format(new Date(transaction.date), 'PPPP')}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell className="capitalize">
                                    <span 
                                    style={{
                                        background: categoryColors[transaction.category],

                                    }}
                                    className='px-2 py-1 rounded text-white text-sm'>
                                        {transaction.category}
                                    </span>
                                    
                                </TableCell>
                                <TableCell className="text-right font-medium"
                                    
                                    style={{
                                        color: transaction.type === "EXPENSE" ? "red" : "green",
                                    }}
                                >
                                    {transaction.type === "EXPENSE" ? "-" : "+"}
                                    {parseFloat(transaction.amount.toFixed(2)).toLocaleString('en-US', { style: 'currency', currency: 'INR' })}
                                </TableCell>
                                <TableCell className="text-center">
                                    {transaction.isRecurring ? (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                   <Badge variant="outline" className="gap-1 bg-purple-100 text-purple-500 hover:bg-purple-200 hover:text-purple-600 transition-colors duration-300">
                                                    <RefreshCw className='h-3 w-3'/>
                                                        {RECURRING_INTERVALS[transaction.recurringInterval]}
                                            
                                                    </Badge>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <div className='text-center'>
                                                        <div> Next Date:</div>
                                                        <div >
                                                            {transaction.nextRecurrenceDate ? format(new Date(transaction.nextRecurrenceDate),'pa') : 'N/A'}
                                                        </div>
                                                        <div>
                                                            {transaction.nextRecurrenceDate ? format(new Date(transaction.nextRecurrenceDate),'PPP') : ''}
                                                        </div>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                
                                        </TooltipProvider>
                                    ) : (
                                        <Badge variant="outline" className="gap-1 bg-teal-100 text-teal-500 hover:bg-teal-200 hover:text-teal-600 transition-colors duration-300">
                                            <Clock className='h-3 w-3'/>
                                                One-Time
                                            
                                        </Badge>
                                        
                                        
                                    )} 
                                </TableCell>

                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "sm" })}>
                                            ...
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem
                                                onClick={() => router.push(`/transactions/create?edit=${transaction.id}`)}
                                            >
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-destructive"
                                                onClick={()=>deletefn([transaction.id])}
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        
                    ))
                    )}
                </TableBody>
            </Table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
                <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                    Page {activePage} of {totalPages}
                </span>
                <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        )}

    </div>
  )
}

export default TransactionTable
