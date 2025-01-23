# Azure Resource Automation with React, Django, and Terraform

![Azure Automation](https://img.shields.io/badge/Azure-Cloud_Services-blue?logo=microsoft-azure)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Django%20%7C%20Terraform%20%7C%20Docker-brightgreen)

A full-stack application that automates Azure resource group creation through a React frontend, Django backend, and Terraform infrastructure-as-code implementation.

**Live Demo**: [http://57.158.24.73:3000/](http://57.158.24.73:3000/)

## 🚀 Features
- User-friendly interface for Azure resource configuration
- Automated resource group creation via Terraform
- Containerized architecture with Docker
- Secure backend API with Django
- Real-time Azure infrastructure management

## ⚙️ Setup Guide

### Prerequisites
- Azure CLI installed
- Docker installed
- Azure VM with public IP
- Valid Azure subscription credentials

### 1. Clone Repository
```bash
git clone https://github.com/rldd-OSU/Terraform_Azure_application.git
cd Terraform_Azure_application
```

### 2. Configuration
1. **Frontend Configuration**:
   - Edit `frontend/src/index.js`:
   ```javascript
   // Replace local IP with your Azure public IP
   const API_ENDPOINT = "http://<AZURE_PUBLIC_IP>:8000";
   ```

2. **Azure VM Networking**:
   - Open ports 3000 (React) and 8000 (Django) in Azure Portal:
   ```bash
   az vm open-port --port 3000 --resource-group <RESOURCE_GROUP> --name <VM_NAME>
   az vm open-port --port 8000 --resource-group <RESOURCE_GROUP> --name <VM_NAME>
   ```

### 3. Docker Setup
**Frontend**:
```bash
cd terraform_azure_frontend
docker build -t terraform_azure_frontend:v1.0 .
docker run -d -p 3000:3000 terraform_azure_frontend:v1.0
```

**Backend**:
```bash
cd ../terraform_azure_backend
docker build -t terraform_azure_backend:v1.0 .
docker run -d -p 8000:8000 terraform_azure_backend:v1.0
```

### 4. Backend Container Setup
1. Access container:
```bash
docker exec -it <BACKEND_CONTAINER_ID> /bin/bash
```

2. Install Terraform:
```bash
apt-get update && apt-get install -y wget gpg lsb-release software-properties-common curl
wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/hashicorp.list
apt-get update && apt-get install -y terraform
```

3. Install Azure CLI:
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | bash
az login --use-device-code
```

4. Initialize Terraform:
```bash
terraform init
```

## 🌐 Access Application
After successful setup, access the application at:
```
http://<YOUR_PUBLIC_IP>:3000
```

## 🔧 Troubleshooting
- **Port Conflicts**: Ensure ports 3000/8000 aren't being used by other services
- **Azure Authentication**: Verify `az login` completed successfully in container
- **Docker Networks**: Check containers are running with `docker ps -a`

## 🔒 Security Notes
- Never commit Azure credentials to version control
- Use environment variables for sensitive data
- Regularly rotate Azure service principals

## 🤝 Contributing
Contributions welcome! Please create an issue before submitting PRs.

## 📄 License
MIT License - see [LICENSE](LICENSE) for details
