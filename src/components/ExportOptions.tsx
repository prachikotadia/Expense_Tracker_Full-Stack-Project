
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useExpenses } from "@/context/ExpenseContext";
import { Download, FileText, Mail, Share, Loader2, Check, FileImage, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportOptionsProps {
  onClose: () => void;
}

const ExportOptions = ({ onClose }: ExportOptionsProps) => {
  const { expenses, currency, getTotalExpenses, getTotalIncome, language } = useExpenses();
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'csv' | 'excel'>('pdf');
  const [exportSuccess, setExportSuccess] = useState(false);
  const [uploadType, setUploadType] = useState<'pdf' | 'image' | 'docs' | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleExportPDF = () => {
    setExporting(true);
    
    // Simulate PDF generation
    setTimeout(() => {
      setExporting(false);
      setExportSuccess(true);
      toast({
        title: language === 'en' ? "PDF Export Complete" : 
               language === 'es' ? "Exportación PDF completada" :
               language === 'hi' ? "पीडीएफ निर्यात पूर्ण" :
               language === 'gu' ? "પીડીએફ નિકાસ પૂર્ણ" : 
               "PDF Export Complete",
        description: language === 'en' ? "Your transaction data has been exported to PDF" :
                    language === 'es' ? "Sus datos de transacciones se han exportado a PDF" :
                    language === 'hi' ? "आपका लेनदेन डेटा पीडीएफ में निर्यात किया गया है" :
                    language === 'gu' ? "તમારો વ્યવહાર ડેટા પીડીએફમાં નિકાસ કરવામાં આવ્યો છે" :
                    "Your transaction data has been exported to PDF"
      });
      
      // Reset success message after delay
      setTimeout(() => setExportSuccess(false), 3000);
    }, 1500);
  };

  const handleShare = (method: string) => {
    toast({
      title: language === 'en' ? `Share via ${method}` :
             language === 'es' ? `Compartir por ${method}` :
             language === 'hi' ? `${method} के माध्यम से साझा करें` :
             language === 'gu' ? `${method} દ્વારા શેર કરો` :
             `Share via ${method}`,
      description: language === 'en' ? `Your transaction data will be shared via ${method}` :
                  language === 'es' ? `Sus datos de transacciones se compartirán por ${method}` :
                  language === 'hi' ? `आपका लेनदेन डेटा ${method} के माध्यम से साझा किया जाएगा` :
                  language === 'gu' ? `તમારો વ્યવહાર ડેટા ${method} દ્વારા શેર કરવામાં આવશે` :
                  `Your transaction data will be shared via ${method}`
    });
    onClose();
  };

  const handleEmail = () => {
    toast({
      title: language === 'en' ? "Email Sent" :
             language === 'es' ? "Correo enviado" :
             language === 'hi' ? "ईमेल भेजा गया" :
             language === 'gu' ? "ઈમેલ મોકલ્યો" :
             "Email Sent",
      description: language === 'en' ? "Your transaction data has been sent to your email" :
                  language === 'es' ? "Sus datos de transacciones se han enviado a su correo electrónico" :
                  language === 'hi' ? "आपका लेनदेन डेटा आपके ईमेल पर भेजा गया है" :
                  language === 'gu' ? "તમારો વ્યવહાર ડેટા તમારા ઈમેલ પર મોકલવામાં આવ્યો છે" :
                  "Your transaction data has been sent to your email"
    });
    onClose();
  };

  const handleUpload = (type: 'pdf' | 'image' | 'docs') => {
    setUploadType(type);
    setUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      setUploading(false);
      toast({
        title: language === 'en' ? `${type.toUpperCase()} Uploaded` :
               language === 'es' ? `${type.toUpperCase()} Subido` :
               language === 'hi' ? `${type.toUpperCase()} अपलोड किया गया` :
               language === 'gu' ? `${type.toUpperCase()} અપલોડ કર્યું` :
               `${type.toUpperCase()} Uploaded`,
        description: language === 'en' ? `Your ${type} has been uploaded successfully` :
                    language === 'es' ? `Su ${type} se ha subido con éxito` :
                    language === 'hi' ? `आपका ${type} सफलतापूर्वक अपलोड किया गया है` :
                    language === 'gu' ? `તમારું ${type} સફળતાપૂર્વક અપલોડ કરવામાં આવ્યું છે` :
                    `Your ${type} has been uploaded successfully`
      });
      setUploadType(null);
    }, 1500);
  };

  return (
    <Card className="w-full backdrop-blur-sm bg-card/80 border-border/40 shadow-sm transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-card to-muted/50 rounded-t-lg">
        <CardTitle className="text-xl">
          {language === 'en' ? "Export Options" :
           language === 'es' ? "Opciones de exportación" :
           language === 'hi' ? "निर्यात विकल्प" :
           language === 'gu' ? "નિકાસ વિકલ્પો" :
           "Export Options"}
        </CardTitle>
        <CardDescription>
          {language === 'en' ? "Choose how you want to export your transaction data" :
           language === 'es' ? "Elija cómo desea exportar sus datos de transacciones" :
           language === 'hi' ? "चुनें कि आप अपने लेनदेन डेटा को कैसे निर्यात करना चाहते हैं" :
           language === 'gu' ? "પસંદ કરો કે તમે તમારા વ્યવહાર ડેટાને કેવી રીતે નિકાસ કરવા માંગો છો" :
           "Choose how you want to export your transaction data"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="flex flex-col h-auto py-6 hover:bg-primary/10 transition-all duration-300 relative overflow-hidden group"
            onClick={handleExportPDF}
            disabled={exporting}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <FileText className="h-8 w-8 mb-2 transition-transform duration-300 group-hover:scale-110" />
            <span className="mt-1">
              {language === 'en' ? "Export as PDF" :
               language === 'es' ? "Exportar como PDF" :
               language === 'hi' ? "पीडीएफ के रूप में निर्यात करें" :
               language === 'gu' ? "પીડીએફ તરીકે નિકાસ કરો" :
               "Export as PDF"}
            </span>
            {exporting && <span className="text-xs animate-pulse mt-1">
              {language === 'en' ? "Generating..." :
               language === 'es' ? "Generando..." :
               language === 'hi' ? "उत्पन्न कर रहा है..." :
               language === 'gu' ? "જનરેટ કરી રહ્યું છે..." :
               "Generating..."}
            </span>}
            {exportSuccess && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-500/80 text-white">
                <Check className="h-8 w-8" />
              </div>
            )}
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col h-auto py-6 hover:bg-primary/10 transition-all duration-300 relative overflow-hidden group"
            onClick={handleEmail}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Mail className="h-8 w-8 mb-2 transition-transform duration-300 group-hover:scale-110" />
            <span className="mt-1">
              {language === 'en' ? "Email Report" :
               language === 'es' ? "Informe por correo" :
               language === 'hi' ? "ईमेल रिपोर्ट" :
               language === 'gu' ? "ઈમેલ રિપોર્ટ" :
               "Email Report"}
            </span>
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="flex flex-col h-auto py-6 hover:bg-primary/10 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Share className="h-8 w-8 mb-2 transition-transform duration-300 group-hover:scale-110" />
                <span className="mt-1">
                  {language === 'en' ? "Share" :
                   language === 'es' ? "Compartir" :
                   language === 'hi' ? "साझा करें" :
                   language === 'gu' ? "શેર કરો" :
                   "Share"}
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card/90 backdrop-blur-md border border-border/40">
              <DialogHeader>
                <DialogTitle>
                  {language === 'en' ? "Share Your Financial Report" :
                   language === 'es' ? "Comparta su informe financiero" :
                   language === 'hi' ? "अपनी वित्तीय रिपोर्ट साझा करें" :
                   language === 'gu' ? "તમારો નાણાકીય અહેવાલ શેર કરો" :
                   "Share Your Financial Report"}
                </DialogTitle>
                <DialogDescription>
                  {language === 'en' ? "Choose how you want to share your transaction report" :
                   language === 'es' ? "Elija cómo desea compartir su informe de transacciones" :
                   language === 'hi' ? "चुनें कि आप अपनी लेनदेन रिपोर्ट कैसे साझा करना चाहते हैं" :
                   language === 'gu' ? "પસંદ કરો કે તમે તમારા વ્યવહાર અહેવાલને કેવી રીતે શેર કરવા માંગો છો" :
                   "Choose how you want to share your transaction report"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <Button
                  variant="outline"
                  className="flex flex-col h-auto py-4 hover:bg-primary/10 group transition-all duration-300"
                  onClick={() => handleShare("WhatsApp")}
                >
                  <span className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">📱</span>
                  <span>WhatsApp</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col h-auto py-4 hover:bg-primary/10 group transition-all duration-300"
                  onClick={() => handleShare("Email")}
                >
                  <Mail className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform duration-300" />
                  <span>Email</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col h-auto py-4 hover:bg-primary/10 group transition-all duration-300 col-span-2"
                  onClick={() => handleShare("Download")}
                >
                  <Download className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform duration-300" />
                  <span>Download</span>
                </Button>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={onClose} className="hover:bg-primary/10 transition-all duration-300">
                  {language === 'en' ? "Cancel" :
                   language === 'es' ? "Cancelar" :
                   language === 'hi' ? "रद्द करें" :
                   language === 'gu' ? "રદ કરો" :
                   "Cancel"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Upload Options */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">
            {language === 'en' ? "Upload Documents" :
             language === 'es' ? "Subir documentos" :
             language === 'hi' ? "दस्तावेज़ अपलोड करें" :
             language === 'gu' ? "દસ્તાવેજો અપલોડ કરો" :
             "Upload Documents"}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="flex flex-col h-auto py-4 hover:bg-primary/10 transition-all duration-300 group"
              onClick={() => handleUpload('pdf')} 
              disabled={uploading}
            >
              <FileText className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform duration-300" />
              <span>
                {language === 'en' ? "PDF" :
                 language === 'es' ? "PDF" :
                 language === 'hi' ? "पीडीएफ" :
                 language === 'gu' ? "પીડીએફ" :
                 "PDF"}
              </span>
              {uploadType === 'pdf' && uploading && (
                <Loader2 className="h-4 w-4 animate-spin mt-1" />
              )}
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col h-auto py-4 hover:bg-primary/10 transition-all duration-300 group"
              onClick={() => handleUpload('image')}
              disabled={uploading}
            >
              <FileImage className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform duration-300" />
              <span>
                {language === 'en' ? "Image" :
                 language === 'es' ? "Imagen" :
                 language === 'hi' ? "छवि" :
                 language === 'gu' ? "છબી" :
                 "Image"}
              </span>
              {uploadType === 'image' && uploading && (
                <Loader2 className="h-4 w-4 animate-spin mt-1" />
              )}
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col h-auto py-4 hover:bg-primary/10 transition-all duration-300 group"
              onClick={() => handleUpload('docs')}
              disabled={uploading}
            >
              <Upload className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform duration-300" />
              <span>
                {language === 'en' ? "Docs" :
                 language === 'es' ? "Documentos" :
                 language === 'hi' ? "दस्तावेज़" :
                 language === 'gu' ? "દસ્તાવેજો" :
                 "Docs"}
              </span>
              {uploadType === 'docs' && uploading && (
                <Loader2 className="h-4 w-4 animate-spin mt-1" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button 
          variant="outline" 
          onClick={onClose}
          className="hover:bg-primary/10 transition-all duration-300"
        >
          {language === 'en' ? "Cancel" :
           language === 'es' ? "Cancelar" :
           language === 'hi' ? "रद्द करें" :
           language === 'gu' ? "રદ કરો" :
           "Cancel"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExportOptions;
