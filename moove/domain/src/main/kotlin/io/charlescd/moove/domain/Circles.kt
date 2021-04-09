package io.charlescd.moove.domain

class Circles(private val circles: Collection<Circle> = emptyList()) {

    fun hasDefault() = circles.find { it.isDefaultCircle() } != null

    fun getReferences() = circles.map { it.reference }

    fun forEach(action: (Circle) -> Unit) {
        circles.forEach(action)
    }
}
