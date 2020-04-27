data "template_file" "charles-notifications-extravars" {
  template = file("${path.module}/templates/charles-notifications.tpl")
  vars = {
    db-notifications-user    = var.db-notifications-username
    db-notifications-pass    = var.db-notifications-password
  }
}

data "template_file" "charles-moove-extravars" {
  template = file("${path.module}/templates/charles-moove.tpl")
  vars = {
    db-moove-username    = var.db-moove-username
    db-moove-password    = var.db-moove-password
  }
}
