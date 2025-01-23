# main.tf
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.16.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = "bf6f3448-47b0-4614-82d2-edabccde85c4"
}

resource "azurerm_resource_group" "rg" {
  name     = "testing"
  location = "West Europe"
  tags = {
    environment = "Production"
    source = "test"
    owner = "demo@gmail.com"
  }
}