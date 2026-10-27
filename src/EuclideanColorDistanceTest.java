import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class EuclideanColorDistanceTest {

    @Test
    public void testSameColorDistance() {
        EuclideanColorDistance finder = new EuclideanColorDistance();

        double result = finder.distance(0xFF0000, 0xFF0000);

        assertEquals(0.0, result, 0.000001);
    }
}