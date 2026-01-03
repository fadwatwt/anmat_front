
import { FaYoutube, FaInstagram, FaLinkedin, FaFacebook, FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // تأكد من تثبيت react-icons

function MailInvitation() {
    return (
        <div className={"w-full overflow-y-auto h-screen"}>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16">
                            <img src="/images/logo.png" alt="Company Logo" className="w-full h-full object-cover rounded-full " />
                        </div>
                    </div>

                    <div className="text-center mb-10">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">
                            Welcome to [Company Name]! Your New Journey Begins!
                        </h1>
                    </div>

                    {/* المحتوى النصي */}
                    <div className="text-left space-y-5 text-gray-600">
                        <p className="text-md">Dear Amr,</p>

                        <p className="leading-relaxed">
                            We are pleased to welcome you to our team at <span className="font-semibold text-gray-800">Visionary Publishing</span> for the position of <span className="font-semibold text-gray-800">Content Editor</span> in the <span className="font-semibold text-gray-800">Publishing Department</span>.
                        </p>

                        <p className="leading-relaxed">
                            To complete your onboarding process, please click the button below to finalize your information and activate your account:
                        </p>
                    </div>

                    {/* زر الإجراء (CTA) */}
                    <div className="flex justify-center my-5">
                        <button className="bg-[#3B63F6] hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-95">
                            Complete Your Profile
                        </button>
                    </div>

                    {/* التذييل الداخلي للرسالة */}
                    <div className="text-left space-y-4 text-gray-600 border-t border-gray-50 pt-3">
                        <p>If you have any questions or need assistance during the process, don't hesitate to contact us.</p>
                        <p className="font-medium">Looking forward to working with you!</p>

                        <div className="text-sm space-y-1 pt-2">
                            <p className="font-semibold text-gray-800">Contact Information:</p>
                            <p>HR Email: <a href="mailto:hr@domain.com" className="text-blue-600 hover:underline">hr@domain.com</a></p>
                            <p>Phone: +90 312 213 2965</p>
                        </div>
                    </div>

                    {/* أيقونات التواصل الاجتماعي */}
                    <div className="flex justify-center gap-6 mt-12 text-gray-400">
                        <a href="#" className="hover:text-blue-600 transition-colors"><FaEnvelope size={20} /></a>
                        <a href="#" className="hover:text-red-600 transition-colors"><FaYoutube size={20} /></a>
                        <a href="#" className="hover:text-pink-600 transition-colors"><FaInstagram size={20} /></a>
                        <a href="#" className="hover:text-black transition-colors"><FaXTwitter size={20} /></a>
                        <a href="#" className="hover:text-blue-700 transition-colors"><FaLinkedin size={20} /></a>
                        <a href="#" className="hover:text-blue-800 transition-colors"><FaFacebook size={20} /></a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MailInvitation;