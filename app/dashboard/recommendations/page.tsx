import { getRecommendationsByDoctor } from "@/app/actions/recommendation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { formatDistanceToNow } from "date-fns";
import { RecommendationStatusSelect } from "./_components/recommendation-status-select";
import { CreateRecommendationForm } from "./_components/create-recommendation-form";
import { getCurrentRoleId } from "@/app/actions/user";
import { getPatients } from "@/app/actions/patients";

export default async function DoctorRecommendationsPage() {
  const doctorId = await getCurrentRoleId();

  if (!doctorId) return;

  const patients = await getPatients();
  if (!patients) return;

  const { recommendations } = await getRecommendationsByDoctor();

  return (
    <div className="container mx-auto py-6 space-y-8 px-4">
      <h1 className="text-3xl font-bold">Recommendations</h1>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">All Recommendations</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {recommendations && recommendations.length > 0 ? (
            recommendations.map((recommendation) => (
              <Card key={recommendation.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {recommendation.type}
                      </CardTitle>
                      <CardDescription>
                        For: {recommendation.patient.user.firstName}{" "}
                        {recommendation.patient.user.lastName}
                      </CardDescription>
                    </div>
                    <RecommendationStatusSelect
                      recommendationId={recommendation.id}
                      initialStatus={recommendation.status}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{recommendation.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Created{" "}
                    {formatDistanceToNow(new Date(recommendation.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-2">
                  No recommendations found
                </p>
                <p className="text-sm text-muted-foreground">
                  Create your first recommendation by clicking the "Create New"
                  tab
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="create">
          <CreateRecommendationForm doctorId={doctorId} patients={patients} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
