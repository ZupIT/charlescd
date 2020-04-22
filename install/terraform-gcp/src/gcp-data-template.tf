data "template_file" "charles-postgresql-extravars" {
  template = file("${path.module}/templates/charles-postgresql-extravars.tpl")
  vars = {
    postgres_password     = "firstpassword"
    charlesnotifications_password  = random_password.charlesnotifications_password.result
    charlesmoove_password = random_password.charlesmoove_password.result
  }
}

resource "random_password" "charlesnotifications_password" {
  length           = 16
  special          = false
  override_special = "_%@/"
}

resource "random_password" "charlesmoove_password" {
  length           = 16
  special          = false
  override_special = "_%@/"
}
