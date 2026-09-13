import { Resend } from "resend";
export async function SendEmail({to, subject, react}) {
    const resend =new Resend(process.env.RESEND_API_KEY || "");

    try{
        const { data, error } = await resend.emails.send({
            from: "Nikhil <onboarding@resend.dev>",
            to,
            subject,
            react,
        });

        if (error) {
            return { success: false, error };
        }

        return {
            success: true,
            data
        }
    }catch(error){
        console.error("Error sending email:", error);
        return {
            success: false,
            error: {
                message: error.message,
                status: error.status,
                response: {
                    data: error.response?.data,
                    headers: error.response?.headers,
                    status: error.response?.status,
                },
            },
        };
    
}
}