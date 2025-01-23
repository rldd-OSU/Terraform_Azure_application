import subprocess
import logging
import os

class TerraformHandler:
    def __init__(self):
        
        self.working_dir = os.path.join(os.getcwd(), 'api')
        print("currnt directory: ", self.working_dir)

        self._validate_directory()
        self.logger = logging.getLogger(__name__)
        logging.basicConfig(level=logging.INFO)

    def _validate_directory(self):
        """Check for Terraform files in working directory"""
        tf_files = [f for f in os.listdir(self.working_dir) if f.endswith('.tf')]
        if not tf_files:
            raise FileNotFoundError(f"No .tf files found in {self.working_dir}")
        
        print(f"Found Terraform files: {', '.join(tf_files)}")

    def run_command(self, command):
        try:
            result = subprocess.run(
                command,
                cwd=self.working_dir,
                check=True,
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            self.logger.info("Command executed successfully: %s", " ".join(command))
            return result.stdout
        except subprocess.CalledProcessError as e:
            self.logger.error("Error executing command: %s\n%s", " ".join(command), e.stderr)
            raise

    def init(self):
        return self.run_command(["terraform", "init"])

    def plan(self):
        return self.run_command(["terraform", "plan"])

    def apply(self):
        return self.run_command(["terraform", "apply", "-auto-approve"])

    def destroy(self):
        return self.run_command(["terraform", "destroy", "-auto-approve"])

    def update_main_tf(self, vaiables):
        template_path = os.path.join(self.working_dir, 'main_tf_template.txt')
        data = open(template_path).read()

        data = data.replace('[name_of_the_resource_group]', vaiables['name'])
        data = data.replace('[enviroment_of_the_resource_group]', vaiables['environment'])
        data = data.replace('[source_of_the_resource_group]', vaiables['source'])
        data = data.replace('[owner_of_the_resource_group]', vaiables['owner'])

        output_path = os.path.join(self.working_dir, 'main.tf')
        with open(output_path, 'w') as f:
            f.write(data)
