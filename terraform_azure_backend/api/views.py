from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .Postgresql_handler import PostgresqlHandler
from.terraform_handler import TerraformHandler

database_handler = PostgresqlHandler()
def create_ResourceGroup(data):
    tf = TerraformHandler()
    tf.update_main_tf(data)
    try:
        print(tf.init())
        print(tf.plan())
        print(tf.apply())
        # print(tf.destroy())
    except Exception as e:
        print(f"Operation failed: {str(e)}")


class CreateResources(APIView):
    def post(self, request):
        print("Received Data:", request.data)  # This will print to console
        database_handler.insert_sample_data(request.data)
        create_ResourceGroup(request.data)
        return Response({"message": "Data received and printed to console"}, 
                      status=status.HTTP_200_OK)

class ResourceListView(APIView):
    def get(self, request):
        # Dummy data matching the React state structure
        data = database_handler.fetch_data()
        # dummy_data = [
        #     {
        #         "name": "Server 1",
        #         "environment": "Production",
        #         "source": "AWS",
        #         "owner": "admin@example.com"
        #     },
        #     {
        #         "name": "Database 2",
        #         "environment": "Staging",
        #         "source": "Azure",
        #         "owner": "dev@example.com"
        #     }
        # ]

        return Response(data, status=status.HTTP_200_OK)
