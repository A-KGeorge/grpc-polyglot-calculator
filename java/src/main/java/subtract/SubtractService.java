package subtract;

import io.grpc.stub.StreamObserver;
import calculator.CalculatorGrpc; // Add this import, adjust the package if needed
import calculator.CalculatorOuterClass.TwoNumbers;
import calculator.CalculatorOuterClass.Number;

public class SubtractService extends CalculatorGrpc.CalculatorImplBase {
    /**
     * Subtracts two integers and returns the result.
     *
     * @param req    The request containing the two integers to subtract.
     * @param resObs The response observer to send the result.
     */
    @Override
    public void subtract(TwoNumbers req, StreamObserver<Number> resObs) {
        double res = req.getA() - req.getB();
        resObs.onNext(Number.newBuilder().setResult(res).build());
        resObs.onCompleted();
    }
}
