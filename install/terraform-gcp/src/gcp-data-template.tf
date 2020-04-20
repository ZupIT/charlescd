data "template_file" "charles-postgresql-extravars" {
  template = file("${path.module}/templates/charles-postgresql-extravars.tpl")
  vars = {
    postgres_password     = "firstpassword"
  }
}