package subtract;

import io.grpc.Server;
import io.grpc.ServerBuilder;

public class SubtractServer {
    public static void main(String[] args) throws Exception {
        Server server = ServerBuilder.forPort(50052)
                .addService(new SubtractService())
                .build()
                .start();
        System.out.println("Subtract server started on port 50052");
        server.awaitTermination();
    }
}
