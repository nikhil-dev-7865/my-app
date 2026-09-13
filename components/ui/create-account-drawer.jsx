"use client";
import { createAccount } from "@/actions/dashboard";
import { accountSchema } from "@/app/lib/schema";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import useFetch from "@/hooks/use-fetch"; // Ensure correct casing
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from 'react';
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";




// State to control the open/close state of the drawer
function CreateAccountDrawer({ children }) {
  
  const [open, setOpen] = React.useState(false);

  const {
    register, handleSubmit, formState: { errors }, setValue, reset, control
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "current",
      balance: "",
      isDefault: false,
    }
  });//

  const isDefault = useWatch({ control, name: "isDefault" });

  // Data for the created account
  const [
    ,
    isLoading, 
    error, 
    fetchCreateAccount
  ] = useFetch(createAccount);

  // Handle error, e.g., show an error message
  useEffect(() => {
    if(error) {
      
      toast.error(error.message || "Failed to create account");
    }
  }, [error]);


  // Here you can handle the form submission, e.g., send data to the server
  const onSubmit = async (data) => {
    const response = await fetchCreateAccount(data);

    if (response?.success) {
      toast.success("Account created successfully");
      reset();
      setOpen(false);
    }
  };


  // Render the drawer with the form
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div data-vaul-no-drag>
          {children}
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Account </DrawerTitle>
          <DrawerDescription>Fill in the details below to create a new account.</DrawerDescription>
          <div>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

              {/*Name*/}

              <div className="space-y-2">
                <label htmlFor="name" className="text-small font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  placeholder="Account Name"
                  {...register("name")} />

                {errors.name &&
                  <p className="text-red-500 text-sm">
                    {errors.name.message}
                  </p>
                }
              </div>

              {/*Type*/}
              <div className="space-y-2">
                <label className="text-small font-medium">
                  Account Type
                </label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex flex-col gap-3 pt-2"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="current" id="current" /> 
                        <label htmlFor="current" className="cursor-pointer">Current</label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="savings" id="savings" />
                        <label htmlFor="savings" className="cursor-pointer">Savings</label>
                      </div>
                    </RadioGroup>
                  )} 
                />

                {errors.type && (
                  <p className="text-red-500 text-sm">{errors.type.message}</p>
                )}
              </div>


              {/*Balance*/}

              <div className="space-y-2">
                <label htmlFor="balance" className="text-small font-medium">
                  Initial Balance
                </label>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  placeholder="₹0.00"
                  {...register("balance")} />
                {errors.balance &&
                  <p className="text-red-500 text-sm">{errors.balance.message}
                  </p>}
              </div>

              {/*Is Default*/}
              
              <div className="spac-y-9 pb-4 border-b">
                <label htmlFor="isDefault" className="text-small font-medium">
                  Set as default account
                </label>
                <Switch id="isDefault"
                  onCheckedChange={(checked) => setValue("isDefault", checked)}
                  checked={isDefault}
                  {...register("isDefault")} />
              </div>

            </form>
          </div>
          <div className="flex gap-4 pt-4">
            <DrawerClose asChild>
              <button type="button" className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
                Cancel
              </button>
            </DrawerClose>
            <DrawerClose asChild>
              <button disabled={isLoading} 
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleSubmit(onSubmit)}
              >
                {isLoading ? "Creating..." : "Create Account"}
              </button>
            </DrawerClose>
          </div>

        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
export default CreateAccountDrawer;