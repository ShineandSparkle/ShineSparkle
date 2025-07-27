
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Award, Users, Target, Lightbulb } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-slate-800">About</h1>
            </div>
          </div>

          {/* About Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">About SHINE & SPARKLE</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Professional cleaning formulation specialists dedicated to providing 
              comprehensive solutions for all your cleaning needs.
            </p>
          </div>

          {/* Company Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-6 w-6 mr-2 text-blue-600" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed">
                  To provide high-quality, effective cleaning formulations that meet the diverse 
                  needs of our customers while maintaining the highest standards of safety and 
                  environmental responsibility. We strive to innovate and develop solutions that 
                  make cleaning efficient and reliable.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-6 w-6 mr-2 text-green-600" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed">
                  To be the leading provider of cleaning formulations, known for our commitment 
                  to quality, innovation, and customer satisfaction. We envision a future where 
                  our products contribute to cleaner, healthier environments for everyone.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="p-6">
                <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Quality</h3>
                <p className="text-slate-600">
                  We maintain the highest standards in all our formulations and processes.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Service</h3>
                <p className="text-slate-600">
                  Customer satisfaction is at the heart of everything we do.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Lightbulb className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Innovation</h3>
                <p className="text-slate-600">
                  We continuously innovate to provide better solutions for our customers.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Company Details */}
          <Card>
            <CardContent className="text-center">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">SHINE & SPARKLE</h3>
              <p className="text-slate-600 mb-2">
                FLAT NO - 202, RK RESIDENCY, HARITHA ROYAL CITY COLONY
              </p>
              <p className="text-slate-600 mb-4">
                RAVALKOLE, MEDCHAL - 501401
              </p>
              <p className="text-slate-700">
                Established as a trusted name in cleaning formulations, we have been serving 
                customers with dedication and expertise. Our comprehensive range of products 
                includes everything from household cleaners to specialized industrial formulations.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
