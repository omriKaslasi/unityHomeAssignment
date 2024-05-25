# Unity Home Assignment
Following are instructions on how to run the project on Minikube

# Install Keda
helm repo add kedacore https://kedacore.github.io/charts
helm repo update
helm install keda kedacore/keda --namespace keda --create-namespace

# Create namespaces
kubectl create namespace api-server
kubectl create namespace web-server
kubectl create namespace kafka
kubectl create namespace mongodb

# Install MongoDB
kubectl apply -f mongodb/
kubectl apply -f mongodb/mongodb.yaml

# Install Kafka:
helm install kafka oci://registry-1.docker.io/bitnamicharts/kafka --set listeners.client.protocol='PLAINTEXT' --set listeners.controller.protocol='PLAINTEXT' -n kafka --create-namespace
kubectl apply -f ./kafka

# Install API server
kubectl apply -f api/manifests

# Install Web server
kubectl apply -f webapp/manifests

# Port-forward web server
kubectl port-forward service/web-server-svc 3000 -n web-server

We can access the site on localhost:3000