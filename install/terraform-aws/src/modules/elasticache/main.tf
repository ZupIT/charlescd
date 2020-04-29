
resource "aws_elasticache_subnet_group" "aws-elasticache" {
  name       = "elasticache-private-subnet-group"
  subnet_ids = var.subnet_ids

  lifecycle {
    ignore_changes = [
      "subnet_ids"
    ]
  }
}

resource "aws_elasticache_replication_group" "aws-elasticache" {
  replication_group_id          = "elasticache-private-subnet-group"
  replication_group_description = "Redis Group Darwin"
  node_type                     = "cache.t2.small"
  port                          = 6379
  parameter_group_name          = aws_elasticache_parameter_group.aws-elasticache-redis.name
  subnet_group_name             = aws_elasticache_subnet_group.aws-elasticache.name
  security_group_ids            = var.secutiry_group_ids
  automatic_failover_enabled    = true
  cluster_mode {
    replicas_per_node_group = 1
    num_node_groups         = 2
  }
}

resource "aws_elasticache_parameter_group" "aws-elasticache-redis" {
  name   = "elasticache-redis"
  family = "redis5.0"

  parameter {
    name  = "activerehashing"
    value = "yes"
  }

  parameter {
    name  = "min-replicas-to-write"
    value = "1"
  }

  parameter {
    name  = "cluster-enabled"
    value = "yes"
  }
}