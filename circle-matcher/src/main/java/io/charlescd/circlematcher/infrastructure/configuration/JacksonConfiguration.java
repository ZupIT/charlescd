package io.charlescd.circlematcher.infrastructure.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;


@Configuration
public class JacksonConfiguration {
    @Bean
    @Primary
    public ObjectMapper objectMapper() {
            ObjectMapper objectMapper = new ObjectMapper();
            JavaTimeModule javaTimeModule = new JavaTimeModule();
            objectMapper.registerModule(javaTimeModule)
                    .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
            return objectMapper;
    }
//    public class LocalDateTimeSerializer extends JsonSerializer<LocalDateTime> {
//        @Override
//        public void serialize(LocalDateTime value, JsonGenerator gen, SerializerProvider serializers) throws IOException { ;
//            gen.writeString(value.format(ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS")));
//        }
//
//    }
//
//    public class LocalDateTimeDeserializer extends JsonDeserializer<LocalDateTime> {
//        @Override
//        public LocalDateTime deserialize(JsonParser p, DeserializationContext deserializationContext) throws IOException {
//            System.out.println(p.getValueAsString());
//            return LocalDateTime.parse(p.getValueAsString(), ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS"));
//        }
//    }
}
