import { useState } from "react";
import { BookOpen, Calendar, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotificationCenter from "@/components/NotificationCenter";
import ProgressDashboard from "@/components/ProgressDashboard";
import SubscriptionManager from "@/components/SubscriptionManager";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();


  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">¡Hola, {user?.email?.split('@')[0] || 'Usuario'}! 👋</h1>
              <p className="text-muted-foreground">Continúa tu viaje de aprendizaje</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Plan {subscription.subscription_tier || 'Gratuito'}
              </Badge>
              <NotificationCenter />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="progress">Mi Progreso</TabsTrigger>
            <TabsTrigger value="subscription">Suscripción</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="progress">
            <ProgressDashboard />
          </TabsContent>

          <TabsContent value="subscription">
            <SubscriptionManager />
          </TabsContent>

          <TabsContent value="notifications">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Centro de Notificaciones</h3>
              <NotificationCenter />
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/courses">
                <Button variant="outline" className="w-full h-16 flex flex-col space-y-2">
                  <BookOpen className="h-6 w-6" />
                  <span>Explorar Cursos</span>
                </Button>
              </Link>
              
              <Link to="/profile">
                <Button variant="outline" className="w-full h-16 flex flex-col space-y-2">
                  <Users className="h-6 w-6" />
                  <span>Mi Perfil</span>
                </Button>
              </Link>
              
              <Link to="/subscription">
                <Button variant="outline" className="w-full h-16 flex flex-col space-y-2">
                  <Calendar className="h-6 w-6" />
                  <span>Mi Suscripción</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;