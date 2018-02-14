package application.mongodb;

import application.ibmcloud.ServiceMappings;

import com.mongodb.Mongo;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientOptions;
import com.mongodb.MongoClientURI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManagerFactory;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.security.KeyStore;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.Base64;

@Configuration
public class MongoClientConfig {

    @Autowired
    protected ServiceMappings mappings;

    @Value("${mongodb_uri:}")
    protected String mongodbUri;

    @Value("${mongodb_ca:}")
    protected String mongodbCACertBase64;

    @Bean
    public Mongo getMongo() throws Exception {
        MongoClientOptions.Builder mcob = null;
        if (mongodbCACertBase64 != null && !mongodbCACertBase64.equals("")) {
            mcob = new MongoClientOptions.Builder()
                    .sslEnabled(true)
                    .sslContext(getSSLContext(mongodbCACertBase64));
        }
        return new MongoClient(new MongoClientURI(mongodbUri, mcob));
    }

    @Bean
    public MongoTemplate mongoTemplate() throws Exception {
        MongoTemplate mt = new MongoTemplate(getMongo(), "compose");
        return mt;
    }

    private SSLContext getSSLContext(String base64Cert) throws Exception {
        InputStream is =
                new ByteArrayInputStream(Base64.getDecoder().decode(base64Cert));
        CertificateFactory cf = CertificateFactory.getInstance("X.509");
        X509Certificate caCert = (X509Certificate) cf.generateCertificate(is);
        TrustManagerFactory tmf = TrustManagerFactory
                .getInstance(TrustManagerFactory.getDefaultAlgorithm());
        KeyStore ks = KeyStore.getInstance(KeyStore.getDefaultType());
        ks.load(null);
        ks.setCertificateEntry("caCert", caCert);
        tmf.init(ks);
        SSLContext sslContext = SSLContext.getInstance("TLS");
        sslContext.init(null, tmf.getTrustManagers(), null);
        return sslContext;
    }

}
