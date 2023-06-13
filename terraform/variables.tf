
variable "region" {
    type = string
    description = "default region for aws project"
    default = "us-west-1"
}

variable "instance_type" {
    type = string
    description = "AWS ec2 instance type. This is a description of how much resources it uses"
    default = "t2.micro"
}

variable "ami" {
    type = string
    description = "Amazon Machine Image: default amazon linux image"
    default = "ami-080f7286ffdf988ee"
}